import {FileDataSource} from './datasource';
import {CSVDataset, TextLineDataset} from './readers';

const runes = `ᚠᛇᚻ᛫ᛒᛦᚦ᛫ᚠᚱᚩᚠᚢᚱ᛫ᚠᛁᚱᚪ᛫ᚷᛖᚻᚹᛦᛚᚳᚢᛗ
ᛋᚳᛖᚪᛚ᛫ᚦᛖᚪᚻ᛫ᛗᚪᚾᚾᚪ᛫ᚷᛖᚻᚹᛦᛚᚳ᛫ᛗᛁᚳᛚᚢᚾ᛫ᚻᛦᛏ᛫ᛞᚫᛚᚪᚾ
ᚷᛁᚠ᛫ᚻᛖ᛫ᚹᛁᛚᛖ᛫ᚠᚩᚱ᛫ᛞᚱᛁᚻᛏᚾᛖ᛫ᛞᚩᛗᛖᛋ᛫ᚻᛚᛇᛏᚪᚾ᛬`;

const testBlob = new Blob([runes]);

describe('TextLineDataset', () => {
  it('Produces a stream of DatasetElements containing UTF8-decoded text lines',
     (done) => {
       const source = new FileDataSource(testBlob, {chunkSize: 10});
       const dataset = new TextLineDataset(source);
       dataset.getStream()
           .then(stream => stream.collectRemaining().then(result => {
             expect(result).toEqual([
               {'line': 'ᚠᛇᚻ᛫ᛒᛦᚦ᛫ᚠᚱᚩᚠᚢᚱ᛫ᚠᛁᚱᚪ᛫ᚷᛖᚻᚹᛦᛚᚳᚢᛗ'},
               {'line': 'ᛋᚳᛖᚪᛚ᛫ᚦᛖᚪᚻ᛫ᛗᚪᚾᚾᚪ᛫ᚷᛖᚻᚹᛦᛚᚳ᛫ᛗᛁᚳᛚᚢᚾ᛫ᚻᛦᛏ᛫ᛞᚫᛚᚪᚾ'},
               {'line': 'ᚷᛁᚠ᛫ᚻᛖ᛫ᚹᛁᛚᛖ᛫ᚠᚩᚱ᛫ᛞᚱᛁᚻᛏᚾᛖ᛫ᛞᚩᛗᛖᛋ᛫ᚻᛚᛇᛏᚪᚾ᛬'},
             ]);
           }))
           .then(done)
           .catch(done.fail);
     });
});

const csvData = `ab,cd,ef
ghi,,jkl
,mn,op
1.4,7.8,12
qrs,tu,
v,w,x
y,z`;

const csvDataWithHeaders = `foo,bar,baz
` + csvData;

const csvBlob = new Blob([csvData]);

const csvBlobWithHeaders = new Blob([csvDataWithHeaders]);

describe('CSVDataset', () => {
  it('Produces a stream of DatasetElements containing UTF8-decoded csv data',
     (done) => {
       const source = new FileDataSource(csvBlob, {chunkSize: 10});
       const datasetPromise = CSVDataset.create(source, ['foo', 'bar', 'baz']);
       datasetPromise.then(dataset => {
         expect(dataset.csvColumnNames).toEqual(['foo', 'bar', 'baz']);
         dataset.getStream()
             .then(stream => stream.collectRemaining().then(result => {
               expect(result).toEqual([
                 {'foo': 'ab', 'bar': 'cd', 'baz': 'ef'},
                 {'foo': 'ghi', 'bar': undefined, 'baz': 'jkl'},
                 {'foo': undefined, 'bar': 'mn', 'baz': 'op'},
                 {'foo': 1.4, 'bar': 7.8, 'baz': 12},
                 {'foo': 'qrs', 'bar': 'tu', 'baz': undefined},
                 {'foo': 'v', 'bar': 'w', 'baz': 'x'},
                 {'foo': 'y', 'bar': 'z', 'baz': undefined},
               ]);
             }))
             .then(done)
             .catch(done.fail);
       });
     });
  it('Reads CSV column headers when none are provided', (done) => {
    const source = new FileDataSource(csvBlobWithHeaders, {chunkSize: 10});
    const datasetPromise = CSVDataset.create(source);
    datasetPromise.then(dataset => {
      expect(dataset.csvColumnNames).toEqual(['foo', 'bar', 'baz']);
      dataset.getStream()
          .then(stream => stream.collectRemaining().then(result => {
            expect(result).toEqual([
              {'foo': 'ab', 'bar': 'cd', 'baz': 'ef'},
              {'foo': 'ghi', 'bar': undefined, 'baz': 'jkl'},
              {'foo': undefined, 'bar': 'mn', 'baz': 'op'},
              {'foo': 1.4, 'bar': 7.8, 'baz': 12},
              {'foo': 'qrs', 'bar': 'tu', 'baz': undefined},
              {'foo': 'v', 'bar': 'w', 'baz': 'x'},
              {'foo': 'y', 'bar': 'z', 'baz': undefined},
            ]);
          }))
          .then(done)
          .catch(done.fail);
    });
  });
});
