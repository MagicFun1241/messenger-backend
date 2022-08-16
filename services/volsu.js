const jwtSecret = config.get('jwt');

services.register('volsu', ctx => {
  console.log('handler');
  console.log('body', ctx);

  ctx.database.externalTokens.insert({
    ip: ctx.body.ip,
    token: ctx.body.token
  }, (doc) => {
    ctx.send({
      tokenExternal: doc.token,
    });
  });
});
