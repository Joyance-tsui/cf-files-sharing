// src/storage/r2.js

class R2Storage {
    constructor(bucket) {
        this.bucket = bucket;
    }

    async store(id, file) {
        await this.bucket.put(id, file.stream(), {
            customMetadata: {
                filename: file.name,
                size: file.size.toString(),
                created_at: new Date().toISOString(),
            }
        });
    }

    async retrieve(id) {
        const object = await this.bucket.get(id);
        if (object) {
            return {
                stream: object.body,
                filename: object.customMetadata?.filename || 'unknown',
                storage_type: 'r2'
            };
        }
        return null;
    }

    async delete(id) {
        try {
            await this.bucket.delete(id);
            return true;
        } catch (error) {
            console.error('R2 delete error:', error);
            return false;
        }
    }

    async list() {
        try {
            const objects = await this.bucket.list();
            const files = objects.objects.map(obj => {
                return {
                    id: obj.key,
                    filename: obj.customMetadata?.filename || 'unknown',
                    size: parseInt(obj.customMetadata?.size) || 0,
                    storage_type: 'r2',
                    created_at: obj.customMetadata?.created_at || obj.uploaded
                };
            });
            return files;
        } catch (error) {
            console.error('R2 list error:', error);
            return [];
        }
    }
}

export { R2Storage };
