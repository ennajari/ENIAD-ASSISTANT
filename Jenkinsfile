pipeline {
    agent any

    environment {
        APP_NAME = 'eniad-assistant'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/ennajari/ENIAD-ASSISTANT.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $APP_NAME .'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'echo "Ajouter ici les tests ou linting"'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker run -d -p 8501:8501 $APP_NAME'
            }
        }
    }
}
