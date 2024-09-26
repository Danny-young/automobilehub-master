# import speech_recognition as sr

# recognizer = sr.Recognizer()

# while True:
#     try:
#         with sr.Microphone() as mic:
#             recognizer.adjust_for_ambient_noise(mic, duration=0.2)
#             print("Listening...")
#             audio = recognizer.listen(mic)
            
#             # Recognize speech using Google Web Speech API
#             text = recognizer.recognize_google(audio)
#             print("You said: " + text)

#     except sr.UnknownValueError:
#         print("Google Speech Recognition could not understand audio")
#     except sr.RequestError as e:
#         print("Could not request results from Google Speech Recognition service; {0}".format(e))
#     except KeyboardInterrupt:
#         print("Stopping...")
#         break

import speech_recognition as sr

recognizer = sr.Recognizer()

while True:
    with sr.Microphone() as source:
        print("Search...")
        try:
            audio = recognizer.listen(source, timeout=3)  
        except sr.WaitTimeoutError:
            print("Timeout, no speech detected.")
            continue

    try:
        #Using the Google web speech Api
        recognized_text = recognizer.recognize_google(audio, language='english')
        print(recognized_text)

    except sr.UnknownValueError:
        print("Could not understand audio")
    except sr.RequestError as e:
        print("Error with the speech recognition service; {0}".format(e))

#search for nearest car wash