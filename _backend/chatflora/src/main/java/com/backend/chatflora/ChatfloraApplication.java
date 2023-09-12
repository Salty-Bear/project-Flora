package com.backend.chatflora;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Objects;

@SpringBootApplication
public class ChatfloraApplication {

	public static void main(String[] args) throws IOException {

    ClassLoader classLoader = ChatfloraApplication.class.getClassLoader();

    File file =
      new File(Objects.requireNonNull(classLoader.getResource("flora-fbf5b-firebase-adminsdk-u6wkf-ee8437ed3e.json")).getFile());

    FileInputStream serviceAccount =
      new FileInputStream(file.getAbsolutePath());

    FirebaseOptions options = new FirebaseOptions.Builder()
      .setCredentials(GoogleCredentials.fromStream(serviceAccount))
      .setDatabaseUrl("https://flora-fbf5b-default-rtdb.firebaseio.com")
      .build();

    FirebaseApp.initializeApp(options);

    SpringApplication.run(ChatfloraApplication.class, args);
	}

}
