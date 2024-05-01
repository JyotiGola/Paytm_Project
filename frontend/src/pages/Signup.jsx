import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { Heading } from "../components/Heading";
import axios from "axios";
import { useState } from "react";

export const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setuserName] = useState("");
    const [password, setPassword] = useState("");
    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign up"} />
        <SubHeading label={"Enter your infromation to create an account"} />
        <InputBox onChange={e => { setFirstName(e.target.value)}} placeholder="John" label={"First Name"} />
        <InputBox onChange={e => { setLastName(e.target.value)}} placeholder="Doe" label={"Last Name"} />
        <InputBox onChange={e => { setuserName(e.target.value)}} placeholder="harkirat@gmail.com" label={"Email"} />
        <InputBox onChange={e => { setPassword(e.target.value)}} placeholder="123456" label={"Password"} />
        <div className="pt-4">
                    <Button onClick={async() => {
                      const response =  await axios.post("http://localhost:3000/api/v1/user/Signup", {
                                username,
                                firstName,
                                lastName,
                                password },
                            { headers: {'content-type': 'application/json'}} 
                      )
                      localStorage.setItem("token", response.data.token)
                    } 
                    }
                       
                        label={"Sign up"} />
                    
        </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  </div>
}