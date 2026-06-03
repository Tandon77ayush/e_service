@Library('shared') _
pipeline{
    agent { label 'dev'}
    stages{
    stage('code'){
        steps{
            script{
                clone('https://github.com/Tandon77ayush/e_service.git', 'main')
            }
        }
    }
    stage('create env'){
        steps{
            withCredentials([
                file(credentialsId: 'server_env',
                       variable: 'SERVER_ENV'
                    )
                ])
                {
                    sh 'sudo cp "$SERVER_ENV" server/.env'
                }
        }
            
        }
        
    stage('build'){
        steps{
            script{
                build()
            }
        }
    }
    stage('deploy'){
        steps{
            script{
                deploy()
            }
        }
    }

        
    }
    post{
        success{
            mail("Neighborhand pipeline status"' "tandonayush350@gmail.com", "CONGRATS!!!! pipeline built SUCCESSFULLY")
                 }
        failure{
            mail("Neighborhand pipeline status", "tandonayush350@gmail.com", "SORRY!! pipeline build is FAILED")
        }
        
}
}
