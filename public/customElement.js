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
  if (height > 0) {
    CustomElement.setHeight(height);
  }
}

const onSourceChanged = _.debounce(reFetchScore, 2000);

try {
  CustomElement.init((element, _context) => {
    elementCodename = element.config.elementCodename;
    itemId = _context.item.id;

    updateSize();
    CustomElement.observeElementChanges([elementCodename], (_codenames) => onSourceChanged())
    reFetchScore();
  });
}
catch (err) {
  console.error(err);
}



