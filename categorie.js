// Newsletter
document.getElementById('newsletter').addEventListener('submit',e=>{
  e.preventDefault();
  fetch('https://votresite.com/api/subscribe',{method:'POST',body:new FormData(e.target)})
   .then(r=>r.ok?alert('Inscrit !'):alert('Erreur'));
});