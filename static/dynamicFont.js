var dynamicFont = {};
dynamicFont.lineHeight;
dynamicFont.fontHeight;
dynamicFont.minWidth;

dynamicFont.setVisible = function() {
  $('.start').css('visibility', 'visible');
}

dynamicFont.getCSS = function() {
  var height = Math.max(JQwindow.height(), 400);
  dynamicFont.lineHeight = height / 5 + 'px';
  dynamicFont.fontHeight = height / 8 + 'px';
  dynamicFont.minWidth = height / 8 * 7;
  dynamicFont.setOption();
  dynamicFont.setLongtext();
}

dynamicFont.setOption = function() {
  if (!touchable) {
    $('.option').css('line-height', dynamicFont.lineHeight).css('font-size', dynamicFont.fontHeight).css('min-width', dynamicFont.minWidth);
  }
  else {
    $('.option').css('line-height', dynamicFont.lineHeight).css('font-size', dynamicFont.fontHeight);
  }
};

dynamicFont.setLongtext = function() {
  $('.longtext').css('font-size', dynamicFont.fontHeight).css('min-width', dynamicFont.minWidth);
};



dynamicFont.getCSS();