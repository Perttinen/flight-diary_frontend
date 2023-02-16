import axios from "axios";
import { useEffect, useState } from "react";

interface DiaryEntry {
  id: number,
  date: string,
  weather: string,
  visibility: string,
  comment: string
}

type NewDiaryEntry = Omit<DiaryEntry, 'id'>;

const App = () => {
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState('');
  const [weather, setWeather] = useState('');
  const [comment, setComment] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    axios.get<DiaryEntry[]>('http://localhost:3001/api/diaries').then(res => {
      setDiary(res.data);
    });
  },[]);

  const notify = (notification: string) => {
    setNotification(notification);
    setTimeout(() => setNotification(''),3000);
  };

  const addEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const entryToAdd: NewDiaryEntry = {
      date: date,
      visibility: visibility,
      weather: weather,
      comment: comment
    };
    try{
      await axios.post<DiaryEntry>('http://localhost:3001/api/diaries', entryToAdd)
      .then(res => {
        setDiary(diary.concat(res.data));
      });
    }catch(error){
      if(axios.isAxiosError(error)){
        notify(error.response?.data);
      }else{
        console.error('else',error);
      }
    }

    setDate('');
    setVisibility('');
    setWeather('');
    setComment('');
  };

  return (
    <div>
      <h2>Add new entry</h2>
      <h3 style={{color:'red'}}>{notification}</h3>
      <form onSubmit={addEntry}>
        date:&emsp;<input type='date' value={date} onChange={(e)=>setDate(e.target.value)}></input><br/>
          <div>
          visibility: &emsp;
            <label htmlFor='choiceGreat'>great</label>
            <input type='radio' id='choiceGreat' name='visibility' onChange={() => setVisibility('great')}/>&nbsp;
            <label htmlFor='choiceGood'>good</label>
            <input type='radio' id='choiceGood' name='visibility' onChange={() => setVisibility('good')}/>&nbsp;
            <label htmlFor='choiceOk'>ok</label>
            <input type='radio' id='choiceOk' name='visibility' onChange={() => setVisibility('ok')}/>&nbsp;
            <label htmlFor='choicePoor'>poor</label>
            <input type='radio' id='choicePoor' name='visibility' onChange={() => setVisibility('poor')}/>
          </div>
          <div>
          weather: &emsp;
            <label htmlFor='choiceSunny'>sunny</label>
            <input type='radio' id='choiceSunny' name='weather' onChange={() => setWeather('sunny')}/>&nbsp;
            <label htmlFor='choiceRainy'>rainy</label>
            <input type='radio' id='choiceRainy' name='weather' onChange={() => setWeather('rainy')}/>&nbsp;
            <label htmlFor='choiceCloudy'>cloudy</label>
            <input type='radio' id='choiceCloudy' name='weather' onChange={() => setWeather('cloudy')}/>&nbsp;
            <label htmlFor='choiceStormy'>stormy</label>
            <input type='radio' id='choiceStormy' name='weather' onChange={() => setWeather('stormy')}/>&nbsp; 
            <label htmlFor='choiceWindy'>windy</label>
            <input type='radio' id='choiceWindy' name='weather' onChange={() => setWeather('windy')}/>    
          </div>
        comment:&emsp;<input value={comment} onChange={(e)=>setComment(e.target.value)}></input><br/>
        <button type="submit">add</button>
      </form>
      <h2>Diary entries</h2>
  {diary.map(e => <div key={e.id}><h3>{e.date}</h3><p>visibility: {e.visibility}<br/>weather: {e.weather}</p></div>)}
    </div>
  );
};

export default App;
