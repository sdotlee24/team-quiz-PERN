import React, { useEffect, useState } from 'react';
import axios from 'axios'
import teamList from '../TeamName.json';
import court from '../images/court.webp'
function Game() {
    const [stats, setStats] = useState([]);
    const [mode, setMode] = useState("");
    const [team, setTeam] = useState("");
    const [guess, setGuess] = useState("");
    const [hint, setHint] = useState("Hint");
    const [conf, setconf] = useState("");
    const [skipBtn, setSkip] = useState(false);
    const [wrong, setWrong] = useState(false);
    const fetchData = async() => {
        try {
            const response = await axios.get("https://nbaquiz.onrender.com/quiz");
            setStats(response.data.stats);
            setMode(response.data.choice);
            setTeam(response.data.name);
            setconf(response.data.conf + 'ern Conference');
            setHint("Hint");
        } catch (err) {
            console.log(err);
        }  
    }
    const skip = () => {
        setSkip(true);
        setTimeout(() => {
            setSkip(false);
            fetchData();
        }, 900);
    }
    useEffect(() => {
        fetchData();

    }, []);

    const onChange = (event) => {
        setGuess(event.target.value);
    }

    const onSubmit = (g) => {
        console.log(guess);
        const success = team.toLowerCase().includes(g.toLowerCase());

        if (success) {
            const inp = document.querySelector('input');
            inp.classList.add('green-border');
            setTimeout(() => {
                inp.classList.remove('green-border');
            }, 1300); 
            fetchData(); 

        } else {
            setWrong(true);
            setTimeout(() => {
                setWrong(false);
            }, 1400);         
        }
        setGuess("");
    }

    return (
        <div className='main'>
            <div className='search-container'>
                <div className='search-inner'>
                    <input placeholder='Guess Team' onChange={onChange} name='guess' value={guess} className={`input ${wrong? 'red-border': ''}`}></input>
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
            <div className='wrapper'>
            <div className='contents'>
                <img src={court} className='court' alt=''></img>
                <h1 className='stats pg'>{`PG: ${stats[0]}`}</h1>
                <h1 className='stats sg'>{`SG: ${stats[1]}`}</h1>
                <h1 className='stats sf'>{`SF: ${stats[2]}`}</h1>
                <h1 className='stats pf'>{`PF: ${stats[3]}`}</h1>
                <h1 className='stats c'>{`C: ${stats[4]}`}</h1>
                <div className='hint' onClick={() => {setHint(conf)}}>{hint}</div>
                <h1>{`Category: ${mode}`}</h1>
                {skipBtn && <h2>{team}</h2>}
                <button onClick={skip} className='skip'>Skip</button>
            </div>
            </div>
            </div>
    )

    
}


export default Game;