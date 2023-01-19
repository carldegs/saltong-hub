// import { Button } from '@chakra-ui/react';
// import { writeBatch, doc, collection } from 'firebase/firestore';
import React from 'react';

// import { firestore } from '../lib/firebase';

// const MOCK_DATA = Object.entries({}).map(([key, val]) => ({
//   dateId: key,
//   roundNum: val.gameId,
//   word: val.word,
// }));

// const mode = 'mini';

// const importData = async () => {
//   const batch = writeBatch(firestore);

//   MOCK_DATA.forEach((data) => {
//     batch.set(
//       doc(
//         collection(
//           firestore,
//           `saltong${mode.charAt(0).toUpperCase() + mode.slice(1)}Rounds`
//         )
//       ),
//       data
//     );
//   });

//   await batch.commit();
//   console.log('DONE');
// };

const AdminPage: React.FC = () => {
  // const [isLoading, setLoading] = React.useState(false);

  return (
    <div>
      {/* <Button
        onClick={async () => {
          setLoading(true);
          importData();
          setLoading(false);
        }}
        isLoading={isLoading}
      >
        IMPORT
      </Button> */}
    </div>
  );
};

export default AdminPage;
