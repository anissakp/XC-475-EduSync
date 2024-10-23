import React, { useState } from 'react';


const UploadSyllabusButton: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    // just added ********
    const [result, setResult] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            // the endpoint of our cloud function
            const response = await fetch('YOUR_FIREBASE_CLOUD_FUNCTION_ENDPOINT', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            // File successfully uploaded
            console.log('File uploaded successfully');
            const resultData = await response.text();
            setResult(resultData);


            } catch (error) {
                setError('Failed to upload file');
                console.error(error);
            } finally {
                setLoading(false);
        }
    };


    return (
        <div>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button className="button" onClick={handleUpload} disabled={loading}>
            { loading ? 'Uploading...' : 'Upload Syllabus' }
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default UploadSyllabusButton;