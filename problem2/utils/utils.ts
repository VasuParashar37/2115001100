export const getRandomImageUrl = (
  width: number = 300,
  height: number = 300
): string => {
  const randomId = Math.floor(Math.random() * 1000);
  return `https://picsum.photos/id/${randomId}/${width}/${height}`;
};
