async function verifyRefreshJWT(req, res, next){

    const emailJWT = req.body.email;
    const passwordJWT = req.body.password;
    let encodedVal = crypto.createHash('md5').update(passwordJWT).digest('hex');
    const refreshTokenJWT = req.headers["x-access-token"];
    if (!refreshTokenJWT) return res.status(401).send({ auth: false, message: 'No refresh token provided.' });
    
    jwt.verify(refreshTokenJWT, process.env.SECRET_JWT_REFRESH, (err, userInfo) => {
        if (err) {
           return res.status(403).send({ auth: false, message: 'Refresh Token invalid!' });
        }
        next();            
    });
       
    const user = await connection('usuarios')
        .where('usrEmail', emailJWT)
        .where('usrPassword', encodedVal)
        .select('usrId', 'usrNome', 'usrEmail', 'usrNivAcesso')
        .first();
          
        if (!user) {
            return response.status(400).json({ error: 'Não encontrou usuário com este ID'});
        } 
        
        let refreshIdToken = uuidv4(); 
        console.log(refreshIdToken);
                
        let token = jwt.sign({ id: user.usrId, name: user.usrNome, email: user.usrEmail, nivel: user.usrNivAcesso }, process.env.SECRET_JWT, {
            expiresIn: process.env.EXPIREIN_JWT
        });
        let refreshToken = jwt.sign({ id: user.usrId, name: user.usrNome, email: user.usrEmail, nivel: user.usrNivAcesso  }, process.env.SECRET_JWT_REFRESH, {
            expiresIn: process.env.EXPIREIN_JWT_REFRESH
        });

        return response.json({user, token, refreshToken});
}

