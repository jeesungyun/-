import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false, // Next.js 기본 bodyParser 비활성화
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
        multiples: false, // 여러 파일을 처리할지 여부
        uploadDir: uploadDir, // 임시 업로드 경로
        keepExtensions: true, // 확장자 유지
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error('Error during file parsing:', err);
            return res.status(500).json({ error: 'File upload failed' });
        }

        const file = files.IDcard; // 업로드된 파일
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const ext = path.extname(file[0].originalFilename); // 원래 파일 확장자
        const fileName = `${fields.id[0]}${ext}`; // id와 확장자를 결합
        const filePath = path.join(uploadDir, fileName);

        // 파일 이름 변경 및 저장
        fs.rename(file[0].filepath, filePath, (renameErr) => {
            if (renameErr) {
                console.error('Error renaming file:', renameErr);
                return res.status(500).json({ error: 'File renaming failed' });
            }

            res.status(200).json({
                message: 'File uploaded and renamed successfully',
                filePath: `/uploads/${fileName}`,
            });
        });
    });
}
