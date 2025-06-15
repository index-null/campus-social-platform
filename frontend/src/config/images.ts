import imagesData from '@/assets/images.json'

export const images = imagesData['校园生活交友平台图片库']

// 获取随机图片
export const getRandomImage = (category: string) => {
  const categories = images.图片分类
  if (category && categories[category as keyof typeof categories]) {
    const imgs = categories[category as keyof typeof categories].图片
    return imgs[Math.floor(Math.random() * imgs.length)]
  }
  
  // 获取所有图片
  const allImages = Object.values(categories).flatMap(cat => cat.图片)
  return allImages[Math.floor(Math.random() * allImages.length)]
}

// 获取特定场景的图片
export const getImageByScene = (scene: string) => {
  const allImages = Object.values(images.图片分类).flatMap(cat => cat.图片)
  return allImages.find(img => img.适合场景.includes(scene)) || allImages[0]
} 