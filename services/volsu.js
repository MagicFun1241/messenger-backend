/* eslint-disable */
const jwtSecret = config.get('jwt');

const serviceName = 'volsu';

http.authentication.register('volsu', async ctx => {
  console.log('handler');
  console.log('body', ctx);

  if (!jwt.verify(ctx.body.token, jwtSecret)) {
    throw new HttpException('Bad token', HttpStatus.FORBIDDEN);
  }

  const tokenPayload = jwt.decode(ctx.body.token);

  let user = await ctx.database.users.findByExternalId(serviceName, tokenPayload.externalId);
  if (user == null) {
    user = await ctx.database.users.insert(tokenPayload);
  }

  ctx.database.externalTokens.insert({
    ip: ctx.body.ip,
    token: ctx.body.token
  }).then(doc => {
    ctx.send({
      tokenExternal: doc.token,
    });
  });
});
