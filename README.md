# Event Tracker

## Installing

```npm install```

## Running 
```npm start```

## Running Tests
```npm run test```

## Consuming 

### Entire File
```bash
curl -X POST http://localhost:3000/file/test.txt
```

### Last <N> Events of File <FILENAME> 
```bash
 curl -X POST http://localhost:3000/file/<FILENAME>/events/<N>
```

### Last <N> Events of File <FILENAME> filtered by keyword <KEY>
```bash
curl -X POST http://localhost:3000/file/<FILENAME>/events/<N>?keyword=<KEY>
```
