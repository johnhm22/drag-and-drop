'use server';

export const submitForm = async (formData: FormData) => {
  try {
    const URL = process.env.CLOUDINARY_URL!;
    const data = await fetch(URL, {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());
    return { data: data, status: 'success' };
  } catch (e) {
    console.log('Error: ', e);
    return { status: 'error' };
  }
};
