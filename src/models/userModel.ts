import { QueryResult } from 'pg';
import sjcl from 'sjcl';
import jwt from 'jsonwebtoken';

import { getDB } from '../db';
import { UserSignUp, UserSignIn, ResponseObject } from '../types';
import { API_SECRET } from '../constants';

async function userSignUp(userObject: UserSignUp) {
  try {
    let db = await getDB();
    let {
      email,
      username,
      fullName,
      telephone,
      location,
      password,
      avatar,
    } = userObject;

    let hash = sjcl.codec.hex.fromBits(
      sjcl.hash.sha256.hash(password + 'CSIC'),
    );

    let encrypted = sjcl.encrypt('CSIC', hash);

    let values = [
      email,
      username,
      fullName,
      encrypted,
      telephone,
      location,
      avatar,
      'Other',
    ];

    let result: QueryResult = await db.query(
      'INSERT INTO users (email, username, full_name, password, telephone, location, avatar, gender) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      values,
    );

    let { id } = result.rows[0];
    let token = jwt.sign({ id }, API_SECRET);
    {
      let {
        id,
        email,
        username,
        full_name: fullName,
        telephone,
        location,
        avatar,
      } = result.rows[0];
      return {
        success: true,
        data: {
          id,
          email,
          username,
          fullName,
          telephone,
          location,
          avatar,
        },
        message: `User ${fullName} has been added`,
        token: token,
      };
    }
  } catch (e) {
    return {
      success: false,
      data: {},
      message: String(e),
    };
  }
}

async function userSignIn(userObject: UserSignIn) {
  try {
    let db = await getDB();
    let { username, password } = userObject;

    let hash = sjcl.codec.hex.fromBits(
      sjcl.hash.sha256.hash(password + 'CSIC'),
    );

    let result = await db.query('SELECT * FROM users where username = $1', [
      username,
    ]);

    if (result.rows[0]) {
      let decrypted = sjcl.decrypt('CSIC', result.rows[0].password);
      if (hash === decrypted) {
        let { id } = result.rows[0];

        let token = jwt.sign({ id }, API_SECRET);

        return {
          success: true,
          data: {
            id: result.rows[0].id,
            email: result.rows[0].email,
            username: result.rows[0].username,
            full_name: result.rows[0].full_name,
            telephone: result.rows[0].telephone,
            location: result.rows[0].location,
            avatar: result.rows[0].avatar,
          },
          message: 'Login Success',
          token: token,
        };
      }
    } else {
      return {
        success: false,
        data: {},
        message: 'Incorrect email or password.',
      };
    }
  } catch (e) {
    return {
      success: false,
      data: {},
      message: String(e),
    };
  }
}

async function getUserByEmail(email: string) {
  try {
    let db = await getDB();
    let user: QueryResult = await db.query(
      'SELECT * FROM users where email = $1',
      [email],
    );
    let response: ResponseObject = {
      success: true,
      data: user,
      message: 'Successfully get user by its email',
    };
    return response;
  } catch (e) {
    return {
      success: false,
      data: [],
      message: String(e),
    };
  }
}

async function getUserByUsername(username: string) {
  try {
    let db = await getDB();
    let user: QueryResult = await db.query(
      'SELECT * FROM users where username = $1',
      [username],
    );
    let response: ResponseObject = {
      success: true,
      data: user,
      message: 'Successfully get user by its email',
    };
    return response;
  } catch (e) {
    return {
      success: false,
      data: [],
      message: String(e),
    };
  }
}

export default { userSignUp, userSignIn, getUserByEmail, getUserByUsername };
