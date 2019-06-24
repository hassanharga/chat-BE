const cloudinary = require('cloudinary');
const httpStatus = require('http-status-codes');
const userModel = require('../models/userModel');


cloudinary.config({
    cloud_name: 'hassanharga',
    api_key: '171468526652716',
    api_secret: 'xwpzxw_wT-j_5caadkTV7NR0-cg'
});


module.exports = {
    uploadImage(req, res) {
        cloudinary.uploader.upload(req.body.image, async (result) => {
            console.log(result);
            await userModel.update(
                { _id: req.user._id },
                {
                    $push: {
                        images:
                            {
                                imgVersion: result.version,
                                imgId: result.public_id
                            }
                    }
                }
            ).then(() => {
                res.status(httpStatus.OK).json({message:'image uploaded successfully'});
            }).catch(err => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:'error uploading image'});
            });
        })
        // console.log(req.body);
    },
    async setDefaultImage(req,res) {
        // console.log(req.params);
        const {imgVersion, imgId} = req.params;
        await userModel.update(
            { _id: req.user._id },
            {
                
                picVersion: imgVersion,
                picId: imgId
                
            }
        ).then(() => {
            res.status(httpStatus.OK).json({message:'profile image updated successfully'});
        }).catch(err => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:'error updating profile image'});
        });
    }
}