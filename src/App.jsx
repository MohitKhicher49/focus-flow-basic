import { useEffect, useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

const FOCUS_TIME = 25*60;
function App() {
  const [seconds, setSeconds] = useState(FOCUS_TIME);
  const [isRunning , setIsRunning] = useState(false);
  const [sessions ,setSessions] = useState(()=>{
     return  Number(localStorage.getItem('focus-sessions')) || 0;
    
  });

  const[taskInput, setTaskInput] = useState('');

  const [tasks, setTasks] = useState(()=>{
    try{
      return JSON.parse(localStorage.getItem('focus-tasks')) ||[];
    }
    catch{
      return [];
    }
  });

  // timer logic
  useEffect(()=>{
    if(!isRunning) return

    if(seconds === 0){
      setIsRunning(false);
      setSessions((prev) => prev+1)
      setSeconds(FOCUS_TIME)
      return
    }

    const interval = setInterval(()=>{
      setSeconds((prev)=> prev-1)
    },1000)

    return ()=>
      clearInterval(interval);
    },[isRunning,seconds]);

    // save tasks
    useEffect(()=>{
      localStorage.setItem('focus-tasks', JSON.stringify(tasks));
    },[tasks]);

    // save sessions
    useEffect(()=>{
      localStorage.setItem('focus-sessions',sessions.toString());
    }, [sessions]);

    // format timer
    const minutes = Math.floor(seconds/60);
    const remainingSeconds = seconds % 60;

    const formattedTime = `${String(minutes).padStart(2,'0')}:${String(remainingSeconds).padStart(2,'0')}`;

    // add tasks 
    function addTask(e){
      e.preventDefault();

      if(!taskInput.trim()) return

      const newTask ={
        id:Date.now(),
        title: taskInput.trim(),
        completed:false,
      };

      setTasks((prev) => [...prev, newTask]);
      setTaskInput('');
    }

    // toggle task
    function toggleTask(id){
      setTasks((prev) =>
      prev.map((task)=>
        task.id === id ? {...task, completed: !task.completed}:task
      )
     );
   }

  //  delete task
  function deleteTask(id){
    setTasks((prev) => prev.filter((task) =>
    task.id !== id));
  }

  //  reset timer
  function resetTimer(){
    setIsRunning(false);
    setSeconds(FOCUS_TIME)
  }
  const completedTasks =tasks.filter(
    (task)=> task.completed
  ).length;
  const progress = (seconds/FOCUS_TIME)*100;

  
  return (
    <div className="min-h-screen bg-[#09090f] text-white px-4 py-8 sm:px-8">
      <div className='mx-auto max-w-6xl'>
        {/* navbar */}
        <nav className='mb-12 flex items-center justify-between'>
          <h1 className='text-2xl font-bold tracking-tight'>
            Focus<span className='text-violet-500'>Flow</span>
          </h1>

          <div className='rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300'>
            Personal Workspace
          </div>
        </nav>

        {/* welcome */}
        <div className='mb-8'>
          <p className='mb-2 text-sm font-medium text-violet-400 tracking-widest'>
            YOUR PRODUCTIVE SPACE
          </p>
          <h2 className='text-3xl font-bold sm:text-4xl'>
            Stay focused. Get things done.
          </h2>
          <p className='mt-2 text-slate-400'>
            One session at a time. One goal at a time.
          </p>
        </div>

        {/* stats */}

        <div className='mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3'>
          <div className='border rounded-2xl border-white/10 bg-[#13131d] p-5'>
            <p className='text-md to-slate-400'>
              Total tasks
            </p>
            <h3 className='mt-2 font-bold text-3xl'>
                 {tasks.length}
            </h3>
          </div>

          <div className='border rounded-2xl border-white/10 bg-[#13131d] p-5 col-span-2 sm:col-span-1'>
            <p className='text-md to-slate-400'>
              Completed tasks
            </p>
            <h3 className='mt-2 font-bold text-3xl text-emerald-400'>
              {completedTasks} 

            </h3>
          </div>
        </div>
        {/* main grid */}
        <div className='grid gap-6 lg:grid-cols-2'>
          {/* timer section */}
          <section className='rounded-3xl border border-violet-500/20 bg-linear-to-br from-[#20143b] via-[#151326] to-[#13131d] p-6 sm:p-8'>
            <div className='mb-8 '>
              <div>
                <p className='text-violet-300 text-md font-medium'>
                  FOCUS TIMER
                </p>
                <h3 className='mt-1 text-xl font-bold'>
                  Deep Work Session
                </h3>
              </div>

              {/* <div className='border rounded-xl bg-violet-500/10 p-3 text-violet-300'>
                <span className='text-xl'>
                  ⌚⏱️⌛
                </span>
              </div> */}
            </div>

            {/* circular timer */}
            <div className='flex justify-center py-6'>
              <div className=' flex h-64 w-64 items-center justify-center rounded-full ' style={{background:`conic-gradient(#a78bfa ${progress}%, #302344 ${progress}% 100%)`}}>
                <div className='flex h-56 w-56 flex-col items-center justify-center rounded-full bg-[#171329]'>
                  <p className='text-sm text-slate-400'>
                    {isRunning ? 'STAY FOCUSED' :'READY TO FOCUS'} 
                  </p>
                   <h2 className='my-2 text-5xl font-bold tracking-wider tabular-nums'>
                      {formattedTime}
                    </h2>

                    <p className='text-xs text-violet-300'>
                      25 MINUTES SESSION
                    </p>
                </div>
              </div>
            </div>

            {/* timer button */}
            <div className='mt-6 flex justify-center gap-3'>
                <button type='button'
                onClick={()=> setIsRunning(!isRunning)}
                className='min-w-32 rounded-xl bg-violet-600 px-6 py-3 font-semibold transition hover:bg-violet-500 active:scale-95'>
                  {isRunning?'Pause' :'Start Focus'}
                </button>
                <button type="button"
                onClick={resetTimer}
                className='rounded-xl border border-white/10 bg-white/5 px-6 py-3 to-slate-300 transition hover:bg-white/10 font-semibold'>
                  Reset
                </button>
            </div>

            <p className='mt-6 text-center text-sm text-slate-400'>
              Stay away from distraction. Focus on one thing
            </p>
          </section>

          {/* task section */}
          <section className='rounded-3xl border border-white/10 bg-[#13131d] p-6 sm:p-8'>
            <div className='mb-6 flex items-center justify-between'>
              <div >
                <p className='text-md font-semibold text-violet-400'>
                    YOUR DAILY PLAN
                </p>
                <h3 className='mt-1 text-xl font-bold'>
                  My Tasks
                </h3>
              </div>

              <span className='rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-400'>
                {completedTasks}/{tasks.length}
              </span>
            </div>

            {/* task input */}
            <form onSubmit={addTask} 
            className='mb-6 flex gap-2'>
              <input type="text" value={taskInput} onChange={(e)=> setTaskInput(e.target.value)} placeholder='Add a new task...'
              className='min-w-0 flex-1 rounded-xl border border-white/10 bg-[#09090f] px-4 py-3 text-sm outline-none transition focus:border-violet-500' />

              <button type ='submit'
               className='rounded-xl bg-violet-600 px-4 py-3 font-semibold transition hover:bg-violet-500'>
                +
              </button>
            </form>

            {/* task list */}
            <div className='space-y-3'>
              {tasks.length === 0 ? (
                <div className='border rounded-2xl border-dashed border-white/10 py-12 text-center'> 
                  <p className='text-3xl'>⭐</p>
                  <p className='mt-3 font-medium text-slate-300'>No tasks yet</p>
                  <p className='mt-1 text-sm text-slate-300'>
                      Add something you want to achieve.
                  </p>
                </div>
              ) : (
                tasks.map((task) =>(
                  <div key={task.id}
                  className='flex items-center gap-3 border rounded-xl border-white/5 bg-white/3 p-4 transition hover:border-violet-500/30'>
                      <input type="checkbox" checked={task.completed} onChange={()=>toggleTask(task.id)} className='h-5 w-5 shrink-0 accent-violet-500'
                      />
                      <span className={`min-w-0 flex-1 wrap-break-word text-sm ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {task.title}
                      </span>

                      <button type="button"
                      onClick={()=> deleteTask(task.id)}
                       className='shrink-0 rounded-lg px-3 py-2 text-xs transition hover:bg-red-500/10'>
                        🗑️
                      </button>
                  </div>
                ))
              )
              }
            </div>

            {/* task progress */}

            <div className="mt-8">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-400">
                  Task progress
                </span>
                <span className="text-violet-400">
                    {tasks.length ? Math.round((completedTasks/tasks.length)*100):0}%
                  </span>
              </div>

              <div className="h-2 rounded-full bg-white/5">
                <div className="h-full rounded-full bg-violet-500 transition-all duration-300" style={{width:`${tasks.length ? (completedTasks/tasks.length)*100 : 0}%`}}></div>
              </div>
            </div>
          </section>
        </div>
        {/* footer */}
        <footer className='mt-10 border-t border-white/5 py-6 text-center text-sm text-slate-500'>
          FocusFlow © 2026 • Make every minute count
        </footer>
      </div>
    </div>
  )

}
export default App
