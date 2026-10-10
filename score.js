/* =========================================================
   score.js — le système de score commun du cartable
   À inclure dans chaque jeu :  <script src="../score.js"></script>

   À la fin d'une partie, le jeu appelle :
     const r = Cartable.enregistrer("nom-du-jeu", etoiles, total);
   r = { record: true/false, meilleur, totalEtoiles, nouveauTrophee }

   Les scores restent sur le téléphone (aucun compte, rien n'est envoyé).
   ========================================================= */
(function () {
  const CLE = "cartable-scores";
  const TROPHEES = [
    { etoiles: 30,  icone: "🥉", nom: "Bronze" },
    { etoiles: 80,  icone: "🥈", nom: "Argent" },
    { etoiles: 150, icone: "🥇", nom: "Or" },
    { etoiles: 250, icone: "🏆", nom: "Coupe" },
    { etoiles: 400, icone: "👑", nom: "Couronne" },
    { etoiles: 600, icone: "🚀", nom: "Fusée" },
  ];

  function lire() {
    try {
      const d = JSON.parse(localStorage.getItem(CLE) || "{}");
      return { jeux: d.jeux || {} };
    } catch (e) { return { jeux: {} }; }
  }
  function ecrire(d) {
    try { localStorage.setItem(CLE, JSON.stringify(d)); } catch (e) {}
  }
  function totalEtoiles(d) {
    d = d || lire();
    return Object.values(d.jeux).reduce((s, j) => s + (j.etoiles || 0), 0);
  }
  function trophees(total) {
    return TROPHEES.filter(t => total >= t.etoiles);
  }
  function prochain(total) {
    return TROPHEES.find(t => total < t.etoiles) || null;
  }

  function enregistrer(id, etoiles, max) {
    const d = lire();
    const avant = totalEtoiles(d);
    const j = d.jeux[id] || { meilleur: 0, max: max, etoiles: 0, parties: 0 };
    const record = j.parties > 0 && etoiles > j.meilleur;
    j.meilleur = Math.max(j.meilleur, etoiles);
    j.max = max;
    j.etoiles += etoiles;
    j.parties += 1;
    j.derniere = new Date().toISOString();
    d.jeux[id] = j;
    ecrire(d);
    const apres = totalEtoiles(d);
    const gagne = trophees(apres).filter(t => avant < t.etoiles);
    return {
      record,
      premiere: j.parties === 1,
      meilleur: j.meilleur,
      totalEtoiles: apres,
      nouveauTrophee: gagne.length ? gagne[gagne.length - 1] : null,
    };
  }

  function remettreAZero() {
    try { localStorage.removeItem(CLE); } catch (e) {}
  }

  window.Cartable = { enregistrer, lire, totalEtoiles, trophees, prochain, remettreAZero, TROPHEES };
})();
