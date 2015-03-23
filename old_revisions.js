var pickers = document.getElementById("mw-revision-nav");
pickers.innerHTML = pickers.innerHTML.replace(/[\(\)\|]|(&nbsp;)/g, '')

for(i = 0; i < pickers.children.length; i++){
  if(pickers.children[i].innerHTML === 'diff'){
    pickers.children[i].className = "mw-revision-diff_button"
  } else{
    pickers.children[i].className = "mw-revision-nav_button"
  }
}