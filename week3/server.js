
const express = require('express');
const { hash, compare } = require('bcrypt');

const JWT = require('jsonwebtoken');
const secretKey = '3hv46563hD21SuoJHh';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const usersDatabase = [];

/* Algorithms: (REGISTER)
1. import/require express, bcrypt - express app - parse JSON 
2. An empty Arr (for registered users)/DB instance
3. POST /register endpoint.
4. Destructure/extract username, password from req body.
- check if username, password are provided.
5. Hash the password using bcrypt. hash(pass,saltRounds);
6. Create a new user object : id, username,pass.
7. store the user obj in the Arr (push)
8. res.status(201).json({message:'...',... }) DON'T SEND PASSWORDS
- Better try.. catch to handle hashing pass errors.
*/
app.post('/register', async (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send({ message: 'Missing credentials!' });
    return;
  }

  try {
    const saltRounds = 12;
    const hashedPassword = await hash(password, saltRounds);
    // console.log(hashedPassword);

    const newUser = {
      id: usersDatabase.length + 1, //1, 2, ..
      username: username,
      password: hashedPassword
    };

    usersDatabase.push(newUser);

    res.status(201).json({ message: 'Registered Successfully', id: newUser.id, username: newUser.username }); //`...newUser (everything with pass.)
    //send(`Registered Successfully,\n id: ${newUser.id}, username: ${newUser.username} `);
  } catch (err) {
    res.status(500).json({ message: 'Error Registering User.' });
  }
});

/* LOGIN:
1. import jsonwebtoken.
2. create a secret key (just unique string)
3. POST login endpoint.
= extract username, pass -> req body
= check if both username,pass are provided
4. find user by username arr.find()
- check if the user exists (!user)...
5. VERIFY using bcrypt: await compare(pass, user.pass) 
/ await bcrypt.compare.....
- check is pass is valid(!isPassValid)
6. Generate JWT jwt.sign({userObjID}, secretKey) -try
/ex: const user ={username: 'iuewio',isAdmin:false}
     const token= jwt.sign(user,secretKey)
7. Return JWT token to the client res.status.json({token:token})
- handle error of generating jwt.

(need an Arr  of all users/database =we have already)
 */
app.post('/login', async (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send({ message: 'Missing credentials!' });
    return;
  }

  const user = usersDatabase.find(e => e.username === username); //find user ?

  if (!user) {
    res.status(401).json({ message: 'Invalid username!' });
    return;
  }


  try {

    const isPasswordCorrect = await compare(password, user.password); //compare pass with user's pass

    if (!isPasswordCorrect) {
      res.status(401).json({ message: 'Invalid  password!' });
      return;
    }

    const USER_ID = { userId: user.id };
    const token = await JWT.sign(USER_ID, secretKey);

    res.status(200).json({ message: 'Login Successfully ', token: token });

  } catch (err) {
    res.status(500).json({ message: 'Error Logging in(Err with JWT)' });
  }
});

console.log('Hello from here');
console.log('Hello from There');

/*Create a server
1. app.listen(PORT, ()....) */

app.listen(PORT, () => {
  console.log('Running...');
});