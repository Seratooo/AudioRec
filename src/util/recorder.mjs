export default class Recorder{
  constructor(){
    this.audioType = 'audio/webm;codecs=opus' 
    this.mediaRecorder = {}
    this.recordedBlobs = []
  }

  _setup(){
    const options = {MimeType: this.audioType}
    const isSupported = MediaRecorder.isTypeSupported(options.MimeType)
    if(!isSupported){
      const msg = `the codec: ${options.MimeType} isn't supported!!`
      alert(msg)

      throw new Error(msg)
    }
    return options
  }
  startRecording(stream){
    const options = this._setup()
    this.mediaRecorder = new MediaRecorder(stream,options)

    this.mediaRecorder.onstop = (Event) =>{
      console.log('Recorded Blobs', this.recordedBlobs)
    }

    this.mediaRecorder.ondataavailable = (Event) =>{
      if(!Event.data || !Event.data.size) return;

      this.recordedBlobs.push(Event.data)

    }
    this.mediaRecorder.start()
    console.log('Media Recorded started',this.mediaRecorder)
  }

  async stopRecording(){
    if(this.mediaRecorder.state === "inactive") return;
    this.mediaRecorder.stop()
    console.log('media recorded stopped!')
  }
  getRecordingURL(){
    const blob = new Blob(this.recordedBlobs,{type: this.audioType})
    return window.URL.createObjectURL(blob)
  }
}