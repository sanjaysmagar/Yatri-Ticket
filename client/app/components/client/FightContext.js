'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';

 const FlightContext = createContext();

export const FlightProvider = ({ children }) => {
  
  const [flightData, setFlightData] = useState(() =>{
    if(typeof window !== 'undefined'){
      const saveData = localStorage.getItem('flightData')
      return saveData ? JSON.parse(saveData) : null
    }
    return null
  });

  const [ticketId, setTicketId] = useState(() =>{
    if(typeof window !== 'undefined'){
      const saveData = localStorage.getItem('ticketId')
      return saveData ? JSON.parse(saveData) : null
    }
    return null
  })


  useEffect(() =>{
    if(flightData){
      localStorage.setItem('flightData', JSON.stringify(flightData))
    }
    else{
      localStorage.removeItem('flightData')
    }
  },[flightData])

  useEffect(() =>{
    if(ticketId){
      localStorage.setItem('ticketId', JSON.stringify(ticketId))
    }
    else{
      localStorage.removeItem('ticketId')
    }
  },[ticketId])


  return (
    <FlightContext.Provider value={{ flightData, setFlightData, ticketId, setTicketId}}>
      {children}
    </FlightContext.Provider>
  );
};

export const useFlight = () => useContext(FlightContext)