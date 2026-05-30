const UserModel = require('../models/user')

class UserService{
    constructor(userModel = UserModel){
        this.userModel = userModel
    }

    async findOrCreate(profile){
        let user = await this.userModel.findOne({googleId: profile.id})

        if(!user){
            user = await this.userModel.create({
                googleId: profile.id,
                username: profile.username,
                foto: profile.photos[0].value
            })
        }

        return user
    }

    async busca(filtros){
        try{
            const user = await this.userModel.find(filtros)
            return user
        }catch(error){
            throw new Error('Erro ao fazer busca')
        }
    }

    async update(id, profile){
        const updated = await this.userModel.findByIdAndUpdate(id, profile, {new: true})
        if(!updated){
            throw new Error('User nao foi encontrada!')
        }

        return updated
    }

    async delete(id){
        const deleted = await this.userModel.findByIdAndDelete(id)
        if(!deleted){
            throw new Error('Usuario nao foi encontrado!')
        }

        return {message: 'User removida!'}
    }
}

module.exports = UserService