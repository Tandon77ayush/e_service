@Library('shared') _
pipeline{
    agent { label 'dev'}
    stages{
    stage('code copy'){
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
    
}
