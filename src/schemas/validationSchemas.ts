import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export const blogSchema = Yup.object().shape({
    title: Yup.string().min(5, 'Title must be at least 5 characters').max(200).required('Title is required'),
    content: Yup.string().min(50, 'Content must be at least 50 characters').required('Content is required'),
    author: Yup.string().required('Author is required'),
});

