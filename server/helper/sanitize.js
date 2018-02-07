module.exports = {
  html: text =>
    text.replace(
      /[<>]/g,
      char =>
        '\\u' +
        char
          .charCodeAt(0)
          .toString(16)
          .padStart(4, '0'),
    ),
}
