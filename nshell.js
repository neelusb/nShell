function nShell(nShellID, nShellTitleIn, nShellPromptIconIn) {
  nShellPromptIconIn = nShellPromptIconIn || '&gt;'
  var nShellTitle = nShellTitleIn;
  var nShellPromptIcon = nShellPromptIconIn;
  var nShellPrompt = nShellTitle + nShellPromptIcon;
  var shl = document.getElementById(nShellID);
  shl.className += ' nShell';
  var nShellCaseSensitive = true;
  var arrOfPrevCmds = [];
  var curPrevCmd = 0;
  var firstCurPrevCmd = true;
  var addEmptyStringAfterArrayFiltering = false;
  var cmds = {};
  var backupfn;
  shl.innerHTML = '';
  self = this;

  nShell.prototype.post = function(msg) {
    var br = document.createElement('br');
    shl.appendChild(br);
    var span = document.createElement('span');
    span.innerHTML = msg;
    shl.appendChild(span);
  };

  nShell.prototype.setOptions = function(inp) {
    for (var i in inp) {
      if (i == 'case-sensitive' || i == 'caseSensitive') {
        nShellCaseSensitive = inp[i];
      }
      else if (i == 'font-size' || i == 'fontSize') {
        shl.style.fontSize = inp[i];
      }
      else if (i == 'font-family' || i == 'fontFamily') {
        shl.style.fontFamily = inp[i];
      }
      else if (i == 'color') {
        shl.style.color = inp[i];
      }
      else if (i == 'background-color' || i == 'backgroundColor') {
        shl.style.backgroundColor = inp[i];
      }
      else {
        throw '[nShell] #' + nShellID + ': Invalid Option \'' + i + '\'.';
      }
    }
  };

  nShell.prototype.caseSensitive = function(nSOptcs) {
    nShellCaseSensitive = nSOptcs;
  };

  nShell.prototype.fontSize = function(nSOptfs) {
    shl.style.fontSize = nSOptfs;
  };

  nShell.prototype.fontFamily = function(nSOptff) {
    shl.style.fontFamily = nSOptff;
  };

  nShell.prototype.color = function(nSOptclr) {
    shl.style.color = nSOptclr;
  };

  nShell.prototype.backgroundColor = function(nSOptbc) {
    shl.style.backgroundColor = nSOptbc;
  };

  nShell.prototype.setCommand = function() {
    var inp = Array.prototype.slice.call(arguments);
    if (inp.length == 1 && (typeof inp[0] == 'object')) {
      inp = inp[0]
      for (var i in inp) {
        cmds[i] = inp[i];
      }
    }
    else if (inp.length == 2 && typeof inp[0] == 'string') {
      cmds[inp[0]] = inp[1];
    }
    else if (inp.length == 1 && typeof inp[0] == 'function') {
      backupfn = inp[0];
    }
    else {
      throw '[nShell] #' + nShellID + ': Invalid command definition.';
    }
  };

  nShell.prototype.proc = function(inpO) {
    inpO = inpO.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    inp = inpO;
    if (!nShellCaseSensitive) {
      inp = inpO.toLowerCase();
    }

    if (cmds[inp]) {
      for (var i in cmds) {
        if (inp == i) {
          if (typeof cmds[i] == 'function') {
            var rslt = cmds[i]() || '';
            nShell.prototype.post(rslt);
          }
          else {
            nShell.prototype.post(cmds[i]);
          }
        }
      }
    }
    else if (backupfn) {
      backupfn(inp, inp.replace(/ +(?= )/g,'').split(' '));
    }
    else {
      nShell.prototype.post(inpO + ': Command not found.');
    }
  };

  nShell.prototype.throw = function() {
    var inp = Array.prototype.slice.call(arguments);
    if (inp.length == 1) {
      nShell.prototype.post(inp + ': Command not found.');
    }
    else if (inp.length == 2) {
      if (inp[0]) {
        nShell.prototype.post(inp[0] + ': ' + inp[1]);
      }
      else {
        nShell.prototype.post(inp[1]);
      }
    }
    else {
      throw '[nShell] #' + nShellID + ': Invalid throw() error.';
    }
  }

  nShell.prototype.shprompt = function() {
    var br = document.createElement('br');
    if (shl.getElementsByClassName('shprompt')[0]) shl.appendChild(br);
    var span = document.createElement('span');
    span.setAttribute('class', 'shprompt');
    shl.appendChild(span);
    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('autofocus', 'autofocus');
    input.setAttribute('class', 'shpromptinp');
    input.setAttribute('maxlength', '64');
    shl.appendChild(input);
    for (i = 0; i < shl.getElementsByClassName('shprompt').length; i++) {
      shl.getElementsByClassName('shprompt')[i].innerHTML = '<b>' + nShellPrompt + '</b>&nbsp;';
    }
    shl.getElementsByClassName('shpromptinp')[0].focus();
    shl.getElementsByClassName('shpromptinp')[0].select();
  };

  shl.addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) {
      var ele = shl.getElementsByTagName('input')[shl.getElementsByTagName('input').length - 1];
      var eleparent = ele.parentNode;
      var contenti = ele.value;
      var content = contenti.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
      eleparent.removeChild(ele);
      var newele = document.createElement('div');
      newele.className += ' input';
      newele.innerHTML = content;
      eleparent.appendChild(newele);
      if (contenti.replace(/ /g,'')) {
        nShell.prototype.proc(contenti);
      }
      arrOfPrevCmds.unshift(contenti);
      nShell.prototype.shprompt();
      shl.getElementsByTagName('input')[document.getElementsByTagName('input').length - 1].innerHTML = '';
      curPrevCmd = 0;
      firstCurPrevCmd = true;
    }
  });

  shl.addEventListener('keydown', function (e) {
    var key = e.which || e.keyCode;
    if (key === 38) {
      if (firstCurPrevCmd == true) {
        arrOfPrevCmds.unshift(shl.getElementsByTagName('input')[shl.getElementsByTagName('input').length - 1].value);
        firstCurPrevCmd = false;
      }
      if (arrOfPrevCmds[0] == '') {
        addEmptyStringAfterArrayFiltering = true;
      }
      arrOfPrevCmds = arrOfPrevCmds.filter(function(e) {
        return !!e;
      });
      if (addEmptyStringAfterArrayFiltering) {
        arrOfPrevCmds.unshift('');
        addEmptyStringAfterArrayFiltering = false;
      }
      if (arrOfPrevCmds[curPrevCmd + 1] !== undefined) {
        curPrevCmd += 1;
      }
      // shl.getElementsByTagName('input')[0].focus();
      // shl.getElementsByTagName('input')[0].select();
      // shl.getElementsByTagName('input')[0].value = '';
      shl.getElementsByTagName('input')[0].value = arrOfPrevCmds[curPrevCmd];
    }
    else if (key === 40) {
      if (arrOfPrevCmds[curPrevCmd - 1] !== undefined) {
        curPrevCmd -= 1;
      }
      // shl.getElementsByTagName('input')[0].focus();
      // shl.getElementsByTagName('input')[0].select();
      // shl.getElementsByTagName('input')[0].value = '';
      shl.getElementsByTagName('input')[0].value = arrOfPrevCmds[curPrevCmd];
    }
  });

  shl.addEventListener('click', function() {
    shl.getElementsByClassName('shpromptinp')[0].focus();
    shl.getElementsByClassName('shpromptinp')[0].select();
  });

  nShell.prototype.shprompt();
}
