(function(){
  // mobile menu
  var btn=document.querySelector('.menu-btn'), list=document.getElementById('navlist');
  if(btn&&list){
    btn.addEventListener('click',function(){var o=list.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
  }

  // forms: real submission only on the live site (Netlify Forms); preview shows a note instead
  var live=/sssocietyuk\.org$|netlify\.app$/.test(location.hostname);
  [].forEach.call(document.querySelectorAll('form.f'),function(f){
    f.addEventListener('submit',function(e){
      if(live) return;
      e.preventDefault();
      var m=f.parentNode.querySelector('.form-msg');
      if(m){m.style.display='block';m.textContent='This is a preview copy of the website, so the form was not sent. It will work once the site is live on sssocietyuk.org.';}
    });
  });
  if(/[?&]sent=1/.test(location.search)){
    var m=document.querySelector('.form-msg');
    if(m){m.style.display='block';m.textContent='Thank you — your message has been received. A member of the Executive Committee will be in touch.';}
  }

  // constitution page
  var ctext=document.getElementById('ctext'); if(!ctext) return;
  var arts=[].slice.call(ctext.querySelectorAll('details.article'));
  document.getElementById('openAll').onclick=function(){arts.forEach(function(d){d.open=true})};
  document.getElementById('closeAll').onclick=function(){arts.forEach(function(d){d.open=false})};
  function openTarget(){
    var id=location.hash.slice(1); if(!id) return;
    var el=document.getElementById(id); if(!el) return;
    var d=el.closest?el.closest('details.article'):null;
    if(d){d.open=true; setTimeout(function(){el.scrollIntoView({block:'start'})},30);}
  }
  window.addEventListener('hashchange',openTarget); openTarget();
  var originals=arts.map(function(d){return d.querySelector('.art-body').innerHTML});
  var input=document.getElementById('csearch'), status=document.getElementById('cstatus'), base=status.textContent;
  function esc(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
  function highlight(node,re){
    if(node.nodeType===3){
      var t=node.nodeValue; re.lastIndex=0; if(!re.test(t)) return; re.lastIndex=0;
      var span=document.createElement('span');
      span.innerHTML=t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(re,'<mark>$&</mark>');
      node.parentNode.replaceChild(span,node); return;
    }
    if(node.nodeType===1&&node.tagName!=='MARK') [].slice.call(node.childNodes).forEach(function(c){highlight(c,re)});
  }
  var timer;
  input.addEventListener('input',function(){clearTimeout(timer);timer=setTimeout(run,150)});
  function run(){
    var q=input.value.trim(), hits=0;
    arts.forEach(function(d,i){
      var body=d.querySelector('.art-body'); body.innerHTML=originals[i];
      if(q.length<2){d.classList.remove('hidden'); return;}
      var re=new RegExp(esc(q),'gi');
      var match=re.test(d.textContent); re.lastIndex=0;
      d.classList.toggle('hidden',!match);
      if(match){hits++; d.open=true; highlight(body,re);}
    });
    status.textContent = q.length<2 ? base : (hits ? hits+' section'+(hits>1?'s':'')+' mention “'+q+'”' : 'No matches for “'+q+'”');
  }
})();
