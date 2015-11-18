var config = {
  // url de base pour les appels au serveur - ne pas modifier
  baseUrl: 'https://twittometer.herokuapp.com',
  // si true, ignore les tweets plus vieux d'au moins sinceXSeconds ; sinon, les déprécie.
  deleteOldTweets: true,
  // nombres de secondes au-delà duquel les tweets sont ignorés ou dépréciés.
  sinceXSeconds: 1200,
  // nombres de secondes entre chaque rafraîchissement
  searchInterval: 30,
  // poids des favoris dans l'algorithme de tri : plus le chiffre est bas, plus les favoris sont importants.
  favoriteWeight: 5
};