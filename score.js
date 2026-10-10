/* =========================================================
   score.js — les notes du cartable
   À inclure dans chaque jeu :  <script src="../score.js"></script>

   À la fin d'une partie, le jeu appelle :
     const r = Cartable.enregistrer("nom-du-jeu", bonnes, total);
   r = { precedente (null la 1re fois), meilleure, parties }

   Les notes restent sur le téléphone (aucun compte, rien n'est envoyé).
   ========================================================= */
(function () {
  const CLE = "cartable-notes";
  function lire() {
    try { const d = JSON.parse(localStorage.getItem(CLE) || "{}"); return { jeux: d.jeux || {} }; }
    catch (e) { return { jeux: {} }; }
  }
  function enregistrer(id, note, total) {
    const d = lire();
    const j = d.jeux[id] || { parties: 0, meilleure: 0 };
    const precedente = j.parties > 0 ? j.note : null;
    j.note = note; j.total = total;
    j.meilleure = Math.max(j.meilleure, note);
    j.parties += 1;
    j.date = new Date().toISOString();
    d.jeux[id] = j;
    try { localStorage.setItem(CLE, JSON.stringify(d)); } catch (e) {}
    return { precedente, meilleure: j.meilleure, parties: j.parties };
  }
  function remettreAZero() { try { localStorage.removeItem(CLE); } catch (e) {} }
  window.Cartable = { enregistrer, lire, remettreAZero };
})();
