import React, { useEffect, useState } from 'react';
import axios from 'axios'
import teamList from '../TeamName.json';
function Game() {
    const [stats, setStats] = useState([]);
    const [mode, setMode] = useState("");
    const [team, setTeam] = useState("");
    const [guess, setGuess] = useState("");
    const [hint, setHint] = useState("Hint");
    const [conf, setconf] = useState("");
    const fetchData = async() => {
        try {
            const response = await axios.get("http://localhost:3001/quiz");
            setStats(response.data.stats);
            setMode(response.data.choice);
            setTeam(response.data.name);
            setconf(response.data.conf + 'ern Conference');
        } catch (err) {
            console.log(err);
        }  
    }

    useEffect(() => {
        fetchData();

    }, []);

    const onChange = (event) => {
        setGuess(event.target.value);
    }

    const onSubmit = (g) => {
        //Does not work, there are some edgecases: if i pass in empty space, -> True
        
        console.log(guess);
        const success = team.toLowerCase().includes(g.toLowerCase());
        if (success) {
            console.log("hurray");
            fetchData(); 

        } else {
            
        }
        setGuess("");
    }

    return (
        <div>
            <div className='search-container'>
                <div className='search-inner'>
                    <input placeholder='Guess Team' onChange={onChange} name='guess' value={guess}></input>
                    {/* <button type='submit' onClick={onSubmit}></button> */}
                </div>
                <div className='dropdown'>
                    {teamList.filter(t => {
                        const searchTerm = guess.toLowerCase();
                        const tName = t.team.toLowerCase();
                        
                        return (searchTerm && tName.includes(searchTerm))
                    }).slice(0, 4)
                    .map((item, i) => 
                    (<div onClick={() => onSubmit(item.team)} className='d-row' key={i}>
                    {item.team}
                    </div>))}
                </div>
            </div>
            <h1>{`${stats[0]} ${stats[1]} ${stats[2]}`}</h1>
            <h1>{mode}</h1>
            <button onClick={fetchData}>Skip</button>
            <div className='hint' onMouseEnter={() => {setHint(conf)}} onMouseLeave={() => {setHint("Hint")}}>{hint}</div>
            </div>
    )

    
}


export default Game;