if(document.getElementById("mw-revision-nav") != null){
  var pickers = document.getElementById("mw-revision-nav");
  pickers.innerHTML = pickers.innerHTML.replace(/[\(\)\|]|(&nbsp;)/g, '')

  pickers.children[0].className = "mw-revision-diff_button"
  pickers.children[0].className += " left-diff"
  pickers.children[1].className = "mw-revision-nav_button"

  pickers.children[2].className = "mw-revision-nav_button"
  pickers.children[3].className = "mw-revision-diff_button"

  pickers.children[4].className = "mw-revision-nav_button"
  pickers.children[5].className = "mw-revision-diff_button"

  previous = document.createElement('div');
  previous.setAttribute('id', 'revision-previous');
  previous.appendChild(pickers.children[1])
  previous.appendChild(pickers.children[0])


  latest = document.createElement('div');
  latest.setAttribute('id', 'revision-latest');
  latest.appendChild(pickers.children[0])
  latest.appendChild(pickers.children[0])

  newer = document.createElement('div');
  newer.setAttribute('id', 'revision-newer');
  newer.appendChild(pickers.children[0])
  newer.appendChild(pickers.children[0])

  pickers.appendChild(previous)
  pickers.appendChild(latest)
  pickers.appendChild(newer)


  var revisionAuthor = document.getElementById("mw-revision-name");

  var revisionDate = document.getElementById("mw-revision-date");
  var revisionDateTitle = document.createElement("span");
  revisionDateTitle.setAttribute('class', 'revision-info-title');
  var revisionDateTitleText = document.createTextNode(" on ");
  revisionDateTitle.appendChild(revisionDateTitleText);

  var revisionSummary = document.getElementById("mw-revision-summary");
  var revisionSummaryTitle = document.createElement("span");
  revisionSummaryTitle.setAttribute('class', 'revision-info-title');
  var revisionSummaryTitleText = document.createTextNode(" ");
  revisionSummaryTitle.appendChild(revisionSummaryTitleText);

  var infoBox = document.getElementById('mw-revision-info');
  infoBox.innerHTML = ''

  var info = document.createTextNode("This is an old revision of this page by ");

  infoBox.appendChild(info)

  infoBox.appendChild(revisionAuthor)

  infoBox.appendChild(revisionDateTitle)
  infoBox.appendChild(revisionDate)

  infoBox.appendChild(revisionSummaryTitle)
  infoBox.appendChild(revisionSummary)
}