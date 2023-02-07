# Structurizr


## Docker 
### Pull image
```bash
docker pull structurizr/onpremises
docker pull structurizr/lite
```

### Run Image OnPremise
```bash
docker run -it --rm -p 8080:8080 -v PATH:/usr/local/structurizr structurizr/onpremises

docker run -it --rm -p 8080:8080 -v /Users/rnadorp/Documents/Prive/Structurizr/ra:/usr/local/structurizr structurizr/onpremises
```

### Run Image Lite
```bash
docker run -it --rm -p 8080:8080 -v PATH:/usr/local/structurizr structurizr/lite

docker run -it --rm -p 8080:8080 -v /Users/rnadorp/Documents/Prive/Structurizr/ra/:/usr/local/structurizr structurizr/lite
```
