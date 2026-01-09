// Track outgoing click
document.querySelector('.btn').addEventListener('click',()=>{
  gtag('event','click',{event_category:'affiliate',event_label:'amazon'});
});