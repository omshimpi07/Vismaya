import { useState, useEffect } from 'react';
import { Phone, PhoneOff, User, Volume2, Mic, MicOff } from 'lucide-react';

// Main App component
export default function FakeCallSafety() {
  const [callActive, setCallActive] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [micMuted, setMicMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [callerName] = useState("Mom");
  const [callerNumber] = useState("(555) 123-4567");
  const [callInitiated, setCallInitiated] = useState(false);
  
  // Calling sound effect
  useEffect(() => {
    let interval;
    if (callInitiated && !callActive) {
      // Ring for 3 seconds before "answering"
      setTimeout(() => {
        setCallActive(true);
      }, 3000);
    }
    
    if (callActive) {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [callActive, callInitiated]);
  
  // Format timer as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  // Start the fake call process
  const initiateFakeCall = () => {
    setCallInitiated(true);
    setCallTimer(0);
  };
  
  // End the fake call
  const endCall = () => {
    setCallActive(false);
    setCallInitiated(false);
    setCallTimer(0);
    setMicMuted(false);
    setSpeakerOn(false);
  };
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 text-gray-800">
      
      
      {!callInitiated ? (
        /* Main screen before call */
        <div className="flex flex-col items-center justify-center flex-grow w-full max-w-md px-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold mb-2" style={{color: '#8a4fff'}}>Women Safety Feature</h2>
            <p className="text-gray-600 mb-8">Press the button below to receive a fake call from your emergency contact</p>
            
            <button
              onClick={initiateFakeCall}
              className="rounded-full w-32 h-32 flex items-center justify-center shadow-lg mb-4 transform hover:scale-105 transition-transform"
              style={{backgroundColor: '#ff5a87'}}
            >
              <Phone size={48} className="text-white" />
            </button>
            <p className="text-sm text-gray-500">Press to get a fake call</p>
          </div>
          
          <div className="w-full bg-white rounded-lg p-4 shadow-md mb-4">
            <h3 className="font-semibold mb-2" style={{color: '#8a4fff'}}>How it works:</h3>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>• Press the call button to receive a fake call</li>
              <li>• Your phone will ring as if receiving a real call</li>
              <li>• Answer the call to start a simulated conversation</li>
              <li>• Use this to safely exit uncomfortable situations</li>
            </ul>
          </div>
        </div>
      ) : (
        /* Call screen */
        <div className="flex flex-col items-center justify-between flex-grow w-full max-w-md px-6 py-8">
          {!callActive ? (
            /* Incoming call screen */
            <div className="flex flex-col items-center justify-center flex-grow w-full text-center">
              <div className="mb-8 animate-bounce">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <User size={48} style={{color: '#8a4fff'}} />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">{callerName}</h2>
              <p className="text-gray-500 mb-8">{callerNumber}</p>
              <p className="text-lg mb-8 animate-pulse" style={{color: '#8a4fff'}}>Incoming call...</p>
              
              <div className="flex justify-center gap-8 w-full">
                <button 
                  onClick={endCall}
                  className="rounded-full w-16 h-16 flex items-center justify-center shadow-md"
                  style={{backgroundColor: '#ff5a87'}}
                >
                  <PhoneOff size={28} className="text-white" />
                </button>
                
                <button 
                  onClick={() => setCallActive(true)}
                  className="rounded-full w-16 h-16 flex items-center justify-center shadow-md bg-green-500"
                >
                  <Phone size={28} className="text-white" />
                </button>
              </div>
            </div>
          ) : (
            /* Active call screen */
            <div className="flex flex-col items-center justify-between flex-grow w-full">
              <div className="text-center mb-8 pt-12">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 mx-auto">
                  <User size={48} style={{color: '#8a4fff'}} />
                </div>
                <h2 className="text-2xl font-bold mb-1">{callerName}</h2>
                <p className="text-gray-500 mb-2">{callerNumber}</p>
                <p className="text-lg" style={{color: '#8a4fff'}}>{formatTime(callTimer)}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 w-full mb-12">
                <button 
                  onClick={() => setMicMuted(!micMuted)}
                  className={`rounded-lg py-3 flex flex-col items-center ${micMuted ? 'bg-gray-200' : 'bg-white'} shadow`}
                >
                  {micMuted ? <MicOff size={24} style={{color: '#8a4fff'}} /> : <Mic size={24} style={{color: '#8a4fff'}} />}
                  <span className="text-xs mt-1">Mute</span>
                </button>
                
                <button 
                  onClick={() => setSpeakerOn(!speakerOn)}
                  className={`rounded-lg py-3 flex flex-col items-center ${speakerOn ? 'bg-gray-200' : 'bg-white'} shadow`}
                >
                  <Volume2 size={24} style={{color: '#8a4fff'}} />
                  <span className="text-xs mt-1">Speaker</span>
                </button>
                
                <button className="rounded-lg py-3 flex flex-col items-center bg-white shadow">
                  <User size={24} style={{color: '#8a4fff'}} />
                  <span className="text-xs mt-1">Contacts</span>
                </button>
              </div>
              
              <div className="w-full mb-8">
                <button 
                  onClick={endCall}
                  className="rounded-full w-16 h-16 flex items-center justify-center shadow-lg mx-auto"
                  style={{backgroundColor: '#ff5a87'}}
                >
                  <PhoneOff size={28} className="text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
 
    </div>
  );
}