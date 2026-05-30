var JJJJJ = globalThis.this;

JJJJJ.jawaker = {
  gameType: null,
  firstCard: null,
  firstCardType: null,
  canPlay: false,
  autoPlayInterval: null,
  log: function (msg) {
    document.querySelector('#_msg_').innerHTML = msg;
  },
  newWindow: function (partition) {
    JJJJJ.ipc('[open new popup]', {
      alwaysOnTop: false,
      width : 1200,
      height : 900,
      center : true,
      partition: partition || JJJJJ.partition,
      url: document.location.href,
      referrer: document.referrer,
      show: true,
    });
  },
};
JJJJJ.jawaker.autoPlay = function () {
  let playbtn = document.querySelector('#play_btn');
  let stopbtn = document.querySelector('#stop_btn');
  if (playbtn && stopbtn) {
    playbtn.classList.add('hide2');
    stopbtn.classList.remove('hide2');
  } else {
    return;
  }

  JJJJJ.jawaker.canPlay = true;
  localStorage.setItem('autoPlay', 'ok');
  JJJJJ.jawaker.Play();
  JJJJJ.jawaker.autoPlayInterval = setInterval(() => {
    JJJJJ.jawaker.Play();
  }, 1000 * 4);
};
JJJJJ.jawaker.stopPlay = function () {
  let playbtn = document.querySelector('#play_btn');
  let stopbtn = document.querySelector('#stop_btn');
  if (playbtn && stopbtn) {
    playbtn.classList.remove('hide2');
    stopbtn.classList.add('hide2');
  } else {
    return;
  }

  JJJJJ.jawaker.canPlay = false;
  localStorage.setItem('autoPlay', 'no');
  clearInterval(JJJJJ.jawaker.autoPlayInterval);
};

JJJJJ.jawaker.Play = function () {
  if (!JJJJJ.jawaker.canPlay) {
    JJJJJ.jawaker.log('stop Playing');
    return;
  }

  JJJJJ.jawaker.log('check actions ...');

  if (document.querySelector('a.play-now')) {
    JJJJJ.click('a.play-now');
    JJJJJ.jawaker.log('Play Now Clicked');
    JJJJJ.jawaker.busy = false;
    return;
  }
  if (document.querySelector('.player-actions a')) {
    JJJJJ.click('.player-actions a');
    JJJJJ.jawaker.log('Ready Clicked');
    JJJJJ.jawaker.busy = false;
    return;
  }
  if (document.querySelector('#game-summary a')) {
    JJJJJ.click('#game-summary a');
    JJJJJ.jawaker.log('Play Again');
    JJJJJ.jawaker.busy = false;
    return;
  }

  if (document.querySelector('.modal-wrapper button')) {
    JJJJJ.click('.modal-wrapper button');
    JJJJJ.jawaker.log('Back to game Clicked');
    JJJJJ.jawaker.busy = false;
    return;
  }
};
JJJJJ.jawaker.PlayCard = function () {
  if (!JJJJJ.jawaker.canPlay) {
    JJJJJ.jawaker.log('stop Playing');
    return;
  }
  if (JJJJJ.jawaker.busy) {
    JJJJJ.jawaker.log('Thinking ...');
    return;
  }
  JJJJJ.jawaker.busy = true;
  JJJJJ.jawaker.log('Try Playing ');

  JJJJJ.jawaker.played = false;
  JJJJJ.jawaker.firstCardType = null;
  JJJJJ.jawaker.firstCard = null;

  JJJJJ.jawaker.firstCard = document.querySelector('#table-stack .card');

  if (JJJJJ.jawaker.firstCard) {
    if (JJJJJ.jawaker.firstCard.className.contains('heart')) {
      JJJJJ.jawaker.firstCardType = 'heart';
    } else if (JJJJJ.jawaker.firstCard.className.contains('diamond')) {
      JJJJJ.jawaker.firstCardType = 'diamond';
    } else if (JJJJJ.jawaker.firstCard.className.contains('spade')) {
      JJJJJ.jawaker.firstCardType = 'spade';
    } else if (JJJJJ.jawaker.firstCard.className.contains('club')) {
      JJJJJ.jawaker.firstCardType = 'club';
    }
  }

  let cards_heart = document.querySelectorAll('.hand.card-stack.fanned.loose.rotate-bottom.ui-droppable .card[class*="heart"]');
  let cards_diamond = document.querySelectorAll('.hand.card-stack.fanned.loose.rotate-bottom.ui-droppable .card[class*="diamond"]');
  let cards_spade = document.querySelectorAll('.hand.card-stack.fanned.loose.rotate-bottom.ui-droppable .card[class*="spade"]');
  let cards_club = document.querySelectorAll('.hand.card-stack.fanned.loose.rotate-bottom.ui-droppable .card[class*="club"]');
  let cards = [];

  cards_spade.forEach((card) => {
    cards.unshift(card);
  });
  cards_club.forEach((card) => {
    cards.unshift(card);
  });
  cards_heart.forEach((card) => {
    cards.unshift(card);
  });
  cards_diamond.forEach((card) => {
    cards.unshift(card);
  });
  cards.forEach((card, i) => {
    if (card.className.like('*-k-*|*-Q*')) {
      cards.unshift(card);
    }
  });
  cards.forEach((card, i) => {
    if (JJJJJ.jawaker.firstCardType && card.className.contains(JJJJJ.jawaker.firstCardType)) {
      JJJJJ.jawaker.played = true;
      JJJJJ.jawaker.log('try Play like first card');
      setTimeout(() => {
        if (JJJJJ.jawaker.isMyTurn) {
          JJJJJ.click(card);
          JJJJJ.jawaker.log('click like first card');
        }
      }, 100 * i);
    }
    if (!JJJJJ.jawaker.played) {
      JJJJJ.jawaker.log('try Play like any card');
      cards.forEach((card, i) => {
        setTimeout(() => {
          if (JJJJJ.jawaker.isMyTurn) {
            JJJJJ.click(card);
            JJJJJ.jawaker.log('click any card');
          }
        }, 100 * i);
      });
    }
  });

  setTimeout(() => {
    JJJJJ.jawaker.busy = false;
    JJJJJ.jawaker.log('.....................');
  }, 200);
};

JJJJJ.jawaker.handlePanel = function () {
  let panel = document.querySelector('.panel1');
  let panel2 = document.querySelector('.panel2');
  if (document.location.href.like('*games*|*competitions*|*challenges*') && panel) {
    if (document.location.href.like('*tarneeb*|*estimation*|*handgame*|*complex*|*banakil*|*saudi*|*basra*|*leekha*|*sbeetiya*|*kout*|*nathala*|*hareega*|*kasra*|*jack*')) {
      panel.classList.add('hide2');
      panel2.classList.add('hide2');
      JJJJJ.jawaker.stopPlay();
    } else {
      if (JJJJJ.customSetting.windowType.contains('popup')) {
        panel.classList.remove('hide2');
        document.querySelector('#__sb_url').value = document.location.href;
        if (localStorage.getItem('autoPlay') === 'ok') {
          JJJJJ.jawaker.autoPlay();
        }
      } else {
        panel2.classList.remove('hide2');
        JJJJJ.var.session_list.forEach((s) => {
          panel2.innerHTML += `<a class="btn2" onclick="JJJJJ.jawaker.newWindow('${s.name}')"> Open Hack as ( ${s.display} ) </a><br><br>`;
        });
      }
    }
  }
};

if (JJJJJ.customSetting.windowType.contains('popup')) {
  setInterval(() => {
    let seat = document.querySelector('.seat.current');
    if (seat && seat.className.contains('active')) {
      JJJJJ.jawaker.isMyTurn = true;
      JJJJJ.jawaker.log('My Turn ^_^', 200);
      JJJJJ.jawaker.PlayCard();
    } else {
      JJJJJ.jawaker.isMyTurn = false;
      JJJJJ.jawaker.log('.....................');
    }
  }, 200);
  setTimeout(() => {
    document.location.reload();
  }, 1000 * 60 * 15);
}
window.addEventListener('locationchange', function () {
  JJJJJ.jawaker.handlePanel();
});
