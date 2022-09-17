import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Heading,
  ShadowBox,
  Centered,
  Semibold,
  Btn,
  NavigationBar,
  NavBarItem,
} from "../../components";
import { Textfield } from "../textfield/Textfield";
import { logout } from "../../features/userSlice";
import { Update } from "../../actions/update";
import { useDispatch } from "react-redux";
import swal from "sweetalert";

export const UpdateProfile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    var users = JSON.parse(localStorage.getItem("users"));
    /*OLD

    const currentUser = JSON.parse(
      localStorage.getItem(JSON.stringify(user.username))
    );
    */

    //new Array with updated values
    const tempUsers = users.map((obj) => {
      if (obj.username === user.username) {
        return {
          ...obj,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
        };
      }
      return obj;
    });

    //overwrite old array with the new updated one
    users = tempUsers;
    //update localStorage
    localStorage.setItem("users", JSON.stringify(users));
    //find the user in the new updated array
    const currentUser = users.find((item) => item.username === user.username);
    //update Redux store
    dispatch(Update(currentUser));
    swal("All done", "Your details were updated", "success");
    navigate("/dashboard");
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/");
  };

  const validate = Yup.object({
    firstName: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("Please enter your first name"),
    lastName: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Please enter your last name"),
    email: Yup.string().email("This is not a valid email address"),
  });

  return (
    <Centered>
      <div className="w-11/12 md:w-3/4 mx-auto">
        <Heading>Update your personal details</Heading>
        <ShadowBox>
          <div className="md:h-full grid md:grid-cols-5 gap-3">
            <NavigationBar>
              <NavBarItem>
                <Link to="/dashboard" className="text-blue-500">
                  Home
                </Link>
              </NavBarItem>
              <NavBarItem>
                <Link to="/settings" className="text-blue-500">
                  Settings
                </Link>
              </NavBarItem>
              <NavBarItem>
                <Link to="/chat" className="text-blue-500">
                  Chat
                </Link>
              </NavBarItem>
              <NavBarItem>
                <button onClick={(e) => handleLogout(e)}>Log out</button>
              </NavBarItem>
            </NavigationBar>
            <div className="md:col-span-4">
              <div className="w-full md:w-3/4 mx-auto">
                <Formik
                  initialValues={{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                  }}
                  validationSchema={validate}
                  onSubmit={(values) => {
                    handleSubmit(values);
                  }}
                >
                  <Form>
                    <Textfield
                      label="First Name"
                      name="firstName"
                      type="text"
                    />
                    <Textfield label="Last Name" name="lastName" type="text" />
                    <Textfield label="Email" name="email" type="email" />
                    <Btn type="submit">
                      <Semibold>Update Details</Semibold>
                    </Btn>
                  </Form>
                </Formik>
              </div>
            </div>
          </div>
        </ShadowBox>
      </div>
    </Centered>
  );
};
