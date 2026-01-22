import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Type assertion to fix CKEditor compatibility issue
const Editor = ClassicEditor as any;

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

/**
 * CKEditor 5 WYSIWYG Rich Text Editor Component
 */
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder = 'Write your content here...',
    className = '',
}) => {
    return (
        <div className={`ckeditor-wrapper ${className}`}>
            <CKEditor
                editor={Editor}
                data={value}
                onChange={(_event: any, editor: any) => {
                    const data = editor.getData();
                    onChange(data);
                }}
                config={{
                    placeholder: placeholder,
                    toolbar: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        'strikethrough',
                        '|',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'outdent',
                        'indent',
                        '|',
                        'blockQuote',
                        'insertTable',
                        '|',
                        'link',
                        'imageUpload',
                        '|',
                        'undo',
                        'redo',
                    ],
                }}
            />
        </div>
    );
};

