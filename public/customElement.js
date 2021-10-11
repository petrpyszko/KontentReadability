let itemId = "";
let elementCodename = "";

function reFetchScore() {
  $("#loading").show();
  $("#ready").hide();

  fetch(`/.netlify/functions/server/count-score?itemId=${itemId}&element=${elementCodename}`)
    .then(res => res.json())
    .then((res) => {
      $("#ready").show();
      $("#loading").hide();
      $("#ready .score-status").text(res.text_grading);
    });
}

function updateSize() {
  const height = Math.ceil($("html").height());
  CustomElement.setHeight(height);
}

const onSourceChanged = _.debounce(reFetchScore, 2000);

if (window.CustomElement) {
  CustomElement.init((element, _context) => {
    elementCodename = element.config.elementCodename;
    itemId = _context.item.id;
    CustomElement.observeElementChanges([elementCodename], (_codenames) => onSourceChanged())
    reFetchScore();
  });
}

updateSize();




