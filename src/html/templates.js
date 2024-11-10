// src/html/templates.js

export const loginTemplate = (lang = 'en', message = '') => {
  const isZh = lang === 'zh';
  return `
<!DOCTYPE html>
<html lang="${isZh ? 'zh' : 'en'}">
<head>
  <meta charset="UTF-8">
  <title>${isZh ? '登录 - 文件分享' : 'Login - File Share'}</title>
  <style>
  body {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #fff;
    }
    .login-form {
      background: #fff;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
      margin: 1rem;
    }
    input {
      width: 100%;
      padding: 8px;
      margin: 8px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }
    button {
      width: 100%;
      padding: 10px;
      background: #000;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background: #333;
    }
    .error-message {
      color: red;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <div class="login-form">
    <h2>${isZh ? '登录' : 'Login'}</h2>
    ${message ? `<p class="error-message">${message}</p>` : ''}
    <form method="POST" action="auth">
      <input type="password" name="password" placeholder="${isZh ? '密码' : 'Password'}" required>
      <button type="submit">${isZh ? '登录' : 'Login'}</button>
    </form>
  </div>
</body>
</html>
`;
};

export const mainTemplate = (lang = 'en', files = []) => {
  const isZh = lang === 'zh';
  return `
<!DOCTYPE html>
<html lang="${isZh ? 'zh' : 'en'}">
<head>
  <meta charset="UTF-8">
  <title>${isZh ? '文件分享' : 'File Share'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      margin: 0;
      padding: 20px;
      background: #fff;
      color: #000;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    .upload-form {
      background: #fff;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: relative;
    }
    .drag-drop {
      border: 2px dashed #ccc;
      padding: 2rem;
      text-align: center;
      margin-bottom: 1rem;
      position: relative;
    }
    .drag-drop.hover {
      background: #f9f9f9;
    }
    .drag-drop input[type="file"] {
      display: none;
    }
    .drag-drop p {
      margin: 0;
    }
    .drag-drop .file-list {
      margin-top: 1rem;
      text-align: left;
    }
    .drag-drop .file-list li {
      list-style: none;
      margin-bottom: 0.5rem;
    }
    .drag-drop .upload-btn {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
    .drag-drop .open-btn {
      position: absolute;
      bottom: 10px;
      left: 10px;
    }
    .storage-options {
      margin: 1rem 0;
      text-align: center;
    }
    .progress {
      width: 100%;
      height: 4px;
      background: #eee;
      margin: 1rem 0;
      display: none;
    }
    .progress-bar {
      height: 100%;
      background: #000;
      width: 0%;
      transition: width 0.3s;
    }
    .result {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8f8f8;
      border-radius: 4px;
      display: none;
    }
    button {
      background: #000;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background: #333;
    }
    a {
      color: #000;
      text-decoration: underline;
    }
    .file-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 2rem;
    }
    .file-table th, .file-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    .file-table th {
      background: #f9f9f9;
    }
    .delete-btn {
      background: red;
      color: #fff;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    .delete-btn:hover {
      background: darkred;
    }
    .fee-warning {
      margin-top: 1rem;
      color: #888;
      font-size: 0.9rem;
    }
    .uploading-indicator {
      display: none;
      margin-top: 1rem;
      text-align: center;
    }
    .uploading-indicator img {
      width: 50px;
      height: 50px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="upload-form">
      <h2>${isZh ? '上传文件' : 'Upload File'}</h2>
      <div class="drag-drop" id="dragDropArea">
        <p>${isZh ? '将文件拖拽到此处' : 'Drag and drop files here'}</p>
        <ul class="file-list" id="fileList"></ul>
        <input type="file" id="fileInput" multiple>
        <button class="open-btn" onclick="document.getElementById('fileInput').click()">${isZh ? '选择文件' : 'Choose Files'}</button>
        <button class="upload-btn" onclick="uploadFiles()">${isZh ? '上传' : 'Upload'}</button>
      </div>
      <div class="storage-options">
        <label>${isZh ? '存储方式' : 'Storage'}:</label>
        <select id="storageType">
          <option value="r2">R2 ${isZh ? '存储' : 'Storage'}</option>
          <option value="d1">D1 ${isZh ? '数据库' : 'Database'}</option>
        </select>
      </div>
      <div class="fee-warning" id="feeWarning"></div>
      <div class="progress">
        <div class="progress-bar" id="progressBar"></div>
      </div>
      <div class="uploading-indicator" id="uploadingIndicator">
        <p>${isZh ? '正在上传...' : 'Uploading...'}</p>
        <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwgAAAAAAACH5BAEAAAEALAAAAAAQABAAAAIgjI+pq+D9mDEd0dW1HUFW6XoYAOw==" alt="Uploading">
      </div>
      <div class="result" id="uploadResult"></div>
    </div>

    <table class="file-table">
      <thead>
        <tr>
          <th>${isZh ? '文件名' : 'Filename'}</th>
          <th>${isZh ? '大小' : 'Size'}</th>
          <th>${isZh ? '存储类型' : 'Storage Type'}</th>
          <th>${isZh ? '创建时间' : 'Created At'}</th>
          <th>${isZh ? '操作' : 'Actions'}</th>
        </tr>
      </thead>
      <tbody>
        ${files.map(file => `
          <tr>
            <td><a href="file/${file.id}" target="_blank">${file.filename}</a></td>
            <td>${formatSize(file.size)}</td>
            <td>${file.storage_type.toUpperCase()}</td>
            <td>${new Date(file.created_at).toLocaleString(lang)}</td>
            <td><button class="delete-btn" onclick="deleteFile('${file.id}')">${isZh ? '删除' : 'Delete'}</button></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <script>
    function formatSize(bytes) {
      // ... existing code ...
    }

    const dragDropArea = document.getElementById('dragDropArea');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const feeWarning = document.getElementById('feeWarning');
    const progressBar = document.getElementById('progressBar');
    const progress = document.querySelector('.progress');
    const uploadResult = document.getElementById('uploadResult');
    const uploadingIndicator = document.getElementById('uploadingIndicator');
    const storageTypeSelect = document.getElementById('storageType');
    const lang = navigator.language.includes('zh') ? 'zh' : 'en';

    dragDropArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      dragDropArea.classList.add('hover');
    });

    dragDropArea.addEventListener('dragleave', () => {
      dragDropArea.classList.remove('hover');
    });

    dragDropArea.addEventListener('drop', (e) => {
      e.preventDefault();
      dragDropArea.classList.remove('hover');
      fileInput.files = e.dataTransfer.files;
      updateFileList();
    });

    fileInput.addEventListener('change', updateFileList);

    function updateFileList() {
      // ... existing code ...
    }

    async function uploadFiles() {
      const files = fileInput.files;
      if (files.length === 0) return;

      progress.style.display = 'block';
      progressBar.style.width = '0%';
      uploadResult.style.display = 'none';
      uploadingIndicator.style.display = 'block';

      const storageType = storageTypeSelect.value;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        let currentStorageType = storageType;
        if (file.size > 25 * 1024 * 1024 && currentStorageType !== 'r2') {
          currentStorageType = 'r2';
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('storage', currentStorageType);

        try {
          const response = await fetch('upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          const data = await response.json();
          const shareUrl = new URL(\`file/\${data.id}\`, window.location.href).href;

          uploadResult.style.display = 'block';
          uploadResult.innerHTML += \`
            <p>\${lang === 'zh' ? '文件上传成功：' : 'File uploaded successfully:'} <a href="\${shareUrl}" target="_blank">\${data.filename}</a></p>
          \`;

        } catch (error) {
          uploadResult.style.display = 'block';
          uploadResult.innerHTML += (lang === 'zh' ? '上传失败: ' : 'Upload failed: ') + error.message + '<br>';
        }

        progressBar.style.width = \`\${((i + 1) / files.length) * 100}%\`;
      }

      uploadingIndicator.style.display = 'none';

      // Refresh the page to show the updated file list
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    async function deleteFile(id) {
      if (!confirm(lang === 'zh' ? '确定删除此文件？' : 'Are you sure you want to delete this file?')) {
        return;
      }

      const formData = new FormData();
      formData.append('id', id);

      try {
        const response = await fetch('delete', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          window.location.reload();
        } else {
          alert(lang === 'zh' ? '删除失败' : 'Failed to delete');
        }
      } catch (error) {
        alert(lang === 'zh' ? '删除失败: ' : 'Failed to delete: ' + error.message);
      }
    }
  </script>
</body>
</html>
`;
};
