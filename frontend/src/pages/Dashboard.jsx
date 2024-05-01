import { useEffect, useState } from "react"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import axios from "axios"

export const Dashboard = () => {
    let [response, setResponse]=useState({ balance: 0 })
    useEffect(() => {
        const getBalance= async() => {
            const balanceValue = await axios.get("http://localhost:3000/api/v1/account/balance",
                {
                    headers: {
                        'authorization': "Bearer " + localStorage.getItem("token"),
    
                        'Content-Type': 'application/json'
                    }
                })

            setResponse[{ balance: balanceValue.data.balance }]
        
          
        }
        getBalance()
    },[]
    )
   console.log("responsed value", response)

    
                      
    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={response.balance} />
            <Users />
        </div>
    </div>
}
