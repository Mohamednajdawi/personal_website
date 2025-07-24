# Automating ML Pipelines with Docker and CI/CD

*Published: July 15, 2024 | Category: ML | Read Time: 10 min*

Machine learning projects often struggle with the transition from development to production. Here's how I solve this with automation.

## The Problem

Traditional ML workflows are fragmented:
- Data scientists work in notebooks
- Models are trained on different environments
- Deployment is manual and error-prone
- Monitoring is an afterthought

![ML Pipeline Architecture](https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1415&q=80)

## The Solution: End-to-End Automation

### 1. Containerized Training

```dockerfile
FROM python:3.9-slim

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY src/ /app/src/
COPY data/ /app/data/

WORKDIR /app
CMD ["python", "src/train.py"]
```

### 2. Pipeline as Code

```yaml
# .github/workflows/ml-pipeline.yml
name: ML Pipeline
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Daily retraining

jobs:
  train:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Train Model
        run: |
          docker build -t ml-trainer .
          docker run --env-file .env ml-trainer
```

### 3. Model Versioning

Using MLflow for experiment tracking:

```python
import mlflow
import mlflow.sklearn

with mlflow.start_run():
    # Train model
    model = train_model(X_train, y_train)
    
    # Log metrics
    mlflow.log_metric("accuracy", accuracy)
    mlflow.log_metric("f1_score", f1)
    
    # Log model
    mlflow.sklearn.log_model(model, "model")
```

## Architecture Components

### Data Pipeline

```python
class DataPipeline:
    def __init__(self, config):
        self.config = config
        self.validators = []
    
    def extract(self, source):
        """Extract data from various sources"""
        if source.type == 'database':
            return self.extract_from_db(source)
        elif source.type == 'api':
            return self.extract_from_api(source)
        elif source.type == 'file':
            return self.extract_from_file(source)
    
    def transform(self, data):
        """Apply transformations and validations"""
        # Data cleaning
        data = self.clean_data(data)
        
        # Feature engineering
        data = self.engineer_features(data)
        
        # Validation
        for validator in self.validators:
            validator.validate(data)
        
        return data
    
    def load(self, data, destination):
        """Load processed data"""
        if destination.type == 'database':
            self.load_to_db(data, destination)
        elif destination.type == 'file':
            self.load_to_file(data, destination)
```

### Model Training Pipeline

```python
class TrainingPipeline:
    def __init__(self, config):
        self.config = config
        self.mlflow_client = mlflow.tracking.MlflowClient()
    
    def train(self, data):
        with mlflow.start_run():
            # Prepare data
            X_train, X_val, y_train, y_val = self.prepare_data(data)
            
            # Train model
            model = self.train_model(X_train, y_train)
            
            # Evaluate
            metrics = self.evaluate_model(model, X_val, y_val)
            
            # Log everything
            self.log_artifacts(model, metrics)
            
            return model, metrics
    
    def evaluate_model(self, model, X_val, y_val):
        predictions = model.predict(X_val)
        
        metrics = {
            'accuracy': accuracy_score(y_val, predictions),
            'precision': precision_score(y_val, predictions, average='weighted'),
            'recall': recall_score(y_val, predictions, average='weighted'),
            'f1': f1_score(y_val, predictions, average='weighted')
        }
        
        return metrics
    
    def log_artifacts(self, model, metrics):
        # Log metrics
        for name, value in metrics.items():
            mlflow.log_metric(name, value)
        
        # Log model
        mlflow.sklearn.log_model(model, "model")
        
        # Log config
        mlflow.log_params(self.config)
```

### Deployment Pipeline

```python
class DeploymentPipeline:
    def __init__(self, config):
        self.config = config
        self.k8s_client = kubernetes.client.ApiClient()
    
    def deploy(self, model_uri, environment):
        # Create deployment config
        deployment_config = self.create_deployment_config(model_uri)
        
        # Deploy to Kubernetes
        if environment == 'staging':
            self.deploy_to_staging(deployment_config)
        elif environment == 'production':
            self.deploy_to_production(deployment_config)
    
    def create_deployment_config(self, model_uri):
        return {
            'apiVersion': 'apps/v1',
            'kind': 'Deployment',
            'metadata': {'name': 'ml-model-service'},
            'spec': {
                'replicas': self.config.replicas,
                'selector': {'matchLabels': {'app': 'ml-model'}},
                'template': {
                    'metadata': {'labels': {'app': 'ml-model'}},
                    'spec': {
                        'containers': [{
                            'name': 'model-server',
                            'image': f'ml-model:latest',
                            'env': [
                                {'name': 'MODEL_URI', 'value': model_uri}
                            ],
                            'ports': [{'containerPort': 8080}]
                        }]
                    }
                }
            }
        }
```

## Monitoring and Observability

### Model Performance Monitoring

```python
class ModelMonitor:
    def __init__(self, model_name, threshold=0.05):
        self.model_name = model_name
        self.drift_threshold = threshold
        self.reference_data = None
    
    def detect_drift(self, new_data):
        if self.reference_data is None:
            self.reference_data = new_data
            return False
        
        # Statistical tests for drift detection
        drift_scores = []
        
        for column in new_data.columns:
            if new_data[column].dtype in ['float64', 'int64']:
                # KS test for numerical features
                statistic, p_value = ks_2samp(
                    self.reference_data[column], 
                    new_data[column]
                )
                drift_scores.append(p_value)
        
        # Check if any feature shows significant drift
        drift_detected = any(score < self.drift_threshold for score in drift_scores)
        
        if drift_detected:
            self.send_alert(f"Data drift detected for {self.model_name}")
        
        return drift_detected
    
    def monitor_performance(self, predictions, actuals):
        current_accuracy = accuracy_score(actuals, predictions)
        
        # Compare with baseline
        baseline_accuracy = self.get_baseline_accuracy()
        
        if current_accuracy < baseline_accuracy * 0.95:  # 5% degradation
            self.send_alert(f"Performance degradation detected: {current_accuracy:.3f}")
        
        # Log metrics
        mlflow.log_metric("current_accuracy", current_accuracy)
        
        return current_accuracy
```

### Infrastructure Monitoring

```python
class InfrastructureMonitor:
    def __init__(self):
        self.metrics_client = prometheus_client
    
    def monitor_resources(self):
        # CPU usage
        cpu_usage = psutil.cpu_percent(interval=1)
        self.metrics_client.Gauge('ml_pipeline_cpu_usage').set(cpu_usage)
        
        # Memory usage
        memory = psutil.virtual_memory()
        self.metrics_client.Gauge('ml_pipeline_memory_usage').set(memory.percent)
        
        # Disk usage
        disk = psutil.disk_usage('/')
        self.metrics_client.Gauge('ml_pipeline_disk_usage').set(disk.percent)
    
    def monitor_model_latency(self, latency):
        self.metrics_client.Histogram('model_inference_latency').observe(latency)
    
    def monitor_throughput(self, requests_per_second):
        self.metrics_client.Gauge('model_requests_per_second').set(requests_per_second)
```

## Testing Strategy

### Unit Tests for ML Code

```python
import pytest
import pandas as pd
from sklearn.datasets import make_classification

class TestMLPipeline:
    @pytest.fixture
    def sample_data(self):
        X, y = make_classification(n_samples=1000, n_features=20, random_state=42)
        return pd.DataFrame(X), pd.Series(y)
    
    def test_data_preprocessing(self, sample_data):
        X, y = sample_data
        pipeline = DataPipeline(config={})
        
        # Test preprocessing
        X_processed = pipeline.transform(X)
        
        assert X_processed.shape[0] == X.shape[0]  # No rows lost
        assert not X_processed.isnull().any().any()  # No missing values
    
    def test_model_training(self, sample_data):
        X, y = sample_data
        trainer = TrainingPipeline(config={})
        
        model, metrics = trainer.train((X, y))
        
        assert model is not None
        assert metrics['accuracy'] > 0.7  # Minimum acceptable accuracy
        assert 0 <= metrics['accuracy'] <= 1  # Valid range
```

### Integration Tests

```python
class TestMLPipelineIntegration:
    def test_full_pipeline(self):
        # Test the entire pipeline end-to-end
        config = {
            'data_source': 'test_data.csv',
            'model_type': 'random_forest',
            'target_accuracy': 0.8
        }
        
        # Run pipeline
        pipeline = MLPipeline(config)
        results = pipeline.run()
        
        assert results['model_accuracy'] >= config['target_accuracy']
        assert results['model_uri'] is not None
        assert results['deployment_status'] == 'success'
```

## Key Benefits

### 1. Reproducibility
Every training run is identical across environments:

```python
# Seed everything for reproducibility
def set_seeds(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    os.environ['PYTHONHASHSEED'] = str(seed)
```

### 2. Scalability
Easy to run on different compute resources:

```yaml
# Scale up for big datasets
resources:
  requests:
    memory: "8Gi"
    cpu: "4"
  limits:
    memory: "16Gi"
    cpu: "8"
```

### 3. Monitoring
Automated alerts for model performance degradation:

```python
def setup_alerts():
    alertmanager_config = {
        'alerts': [
            {
                'name': 'ModelAccuracyDrop',
                'condition': 'accuracy < 0.8',
                'action': 'retrain_model'
            },
            {
                'name': 'DataDriftDetected',
                'condition': 'drift_score > 0.1',
                'action': 'notify_team'
            }
        ]
    }
    return alertmanager_config
```

### 4. Compliance
Full audit trail of model changes:

```python
def log_model_lineage(model, data_version, code_version):
    lineage = {
        'model_id': model.id,
        'data_version': data_version,
        'code_version': code_version,
        'training_timestamp': datetime.now(),
        'hyperparameters': model.get_params(),
        'performance_metrics': model.metrics
    }
    
    # Store in model registry
    mlflow.log_dict(lineage, "model_lineage.json")
```

## Lessons Learned

### Start Simple and Iterate
- Begin with basic automation
- Add complexity gradually
- Focus on biggest pain points first

### Invest in Good Data Validation Early
```python
def validate_data_quality(data):
    checks = [
        ('missing_values', lambda df: df.isnull().sum().sum() == 0),
        ('data_types', lambda df: all(df.dtypes == expected_dtypes)),
        ('value_ranges', lambda df: all(df.select_dtypes(include=[np.number]).min() >= 0)),
        ('schema_consistency', lambda df: list(df.columns) == expected_columns)
    ]
    
    for check_name, check_func in checks:
        if not check_func(data):
            raise ValueError(f"Data quality check failed: {check_name}")
```

### Monitor Everything, Not Just Accuracy
- Input data quality
- Feature importance changes
- Inference latency
- Resource utilization
- Business metrics

### Plan for Model Rollbacks
```python
def rollback_model(previous_version):
    # Switch traffic back to previous version
    update_traffic_routing(previous_version, weight=1.0)
    
    # Update model registry
    mlflow.transition_model_version_stage(
        name="my_model",
        version=previous_version,
        stage="Production"
    )
    
    # Notify team
    send_notification(f"Rolled back to model version {previous_version}")
```

## Conclusion

This automated approach has reduced our deployment time from days to minutes while significantly improving model reliability. The key is to treat ML pipelines as software systems with proper engineering practices.

Key takeaways:
- **Containerization** enables consistent environments
- **Version control** for code, data, and models
- **Automated testing** catches issues early
- **Monitoring** enables proactive maintenance
- **Documentation** ensures knowledge sharing

## Tags
- MLOps
- Docker
- CI/CD
- Automation
- Machine Learning
- DevOps
- Model Deployment
- Production Systems
