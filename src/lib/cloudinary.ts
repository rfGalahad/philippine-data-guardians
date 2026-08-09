const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const getCloudinaryUrl = (
  publicId: string, 
  transforms = 'f_auto,q_auto,w_1920'
) => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
};