export const getDifficultyColor = (difficulty: string) => {
  switch(difficulty) {
    case 'BAJA':
      return 'success';
    case 'MEDIA':
      return 'warning';
    default:
      return 'danger';
  }
}
