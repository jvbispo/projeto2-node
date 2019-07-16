import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation has failed' });
    }

    const emailExists = await User.findOne({
      where: { email: req.body.email },
    });
    if (emailExists) {
      return res.status(400).json({ error: 'email already exists' });
    }

    const { email, name, id } = await User.create(req.body);

    return res.json({
      id,
      email,
      name,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string(),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation has falied' });
    }

    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ error: 'email already exists' });
      }
    }

    if (oldPassword && !(await user.checkpassword(oldPassword))) {
      return res.status(400).json({ error: 'oldpassword invalid' });
    }

    const { id, name } = user.update(req.body);
    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
