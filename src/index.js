// src/index.js

import { Auth } from './auth';
import { StorageManager } from './storage/manager';
import { loginTemplate, mainTemplate } from './html/templates';
import { jsonResponse, htmlResponse, errorResponse } from './utils/response';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const storageManager = new StorageManager(env);

    // Get user's preferred language
    const acceptLanguage = request.headers.get('Accept-Language') || 'en';
    const lang = acceptLanguage.includes('zh') ? 'zh' : 'en';

    // File download handling
    if (url.pathname.includes('/file/')) {
      const id = url.pathname.split('/').pop();
      const file = await storageManager.retrieve(id);

      if (!file) {
        return errorResponse(lang === 'zh' ? '文件未找到' : 'File not found', 404);
      }

      // Handle file download with proper filename encoding
      const filename = file.filename;
      const encodedFilename = encodeURIComponent(filename);
      const contentDisposition = `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`;

      return new Response(file.stream, {
        headers: {
          'Content-Disposition': contentDisposition,
          'Content-Type': 'application/octet-stream',
        },
      });
    }

    // Authentication check
    if (!(await Auth.verifyAuth(request, env))) {
      if (url.pathname.endsWith('/auth') && request.method === 'POST') {
        const formData = await request.formData();
        const password = formData.get('password');

        if (await Auth.validatePassword(password, env)) {
          const token = await Auth.generateToken(env);
          const cookie = Auth.createCookie(token);

          return new Response('', {
            status: 302,
            headers: {
              'Location': '.',
              'Set-Cookie': cookie,
            },
          });
        } else {
          return htmlResponse(loginTemplate(lang, lang === 'zh' ? '密码错误' : 'Invalid password'));
        }
      }
      return htmlResponse(loginTemplate(lang));
    }

    // File deletion handling
    if (url.pathname.endsWith('/delete') && request.method === 'POST') {
      const formData = await request.formData();
      const id = formData.get('id');

      const success = await storageManager.delete(id);

      if (success) {
        return jsonResponse({ success: true });
      } else {
        return jsonResponse({ success: false }, 400);
      }
    }

    // File upload handling
    if (url.pathname.endsWith('/upload') && request.method === 'POST') {
      const formData = await request.formData();
      const file = formData.get('file');
      let storageType = formData.get('storage');

      // Enforce R2 storage for files larger than 25MB
      if (file.size > 25 * 1024 * 1024 && storageType !== 'r2') {
        storageType = 'r2';
      }

      const metadata = await storageManager.store(file, storageType);

      return jsonResponse({
        id: metadata.id,
        filename: metadata.filename,
        size: metadata.size,
        storage_type: metadata.storage_type,
      });
    }

    // Main page
    if (url.pathname === '/' || url.pathname.endsWith('/')) {
      const files = await storageManager.list();

      return htmlResponse(mainTemplate(lang, files));
    }

    return errorResponse(lang === 'zh' ? '未找到页面' : 'Not found', 404);
  },
};
