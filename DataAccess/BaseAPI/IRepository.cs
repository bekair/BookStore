using EntityStore.Base;

namespace DataAccess.BaseAPI
{
    public interface IRepository<TEntity> where TEntity : class, IEntity
    {
        void Insert(TEntity entity);
        void AddOrUpdate(TEntity entity);
        void Update(TEntity entity);
        void Delete(object id);
        void Delete(TEntity entity);
        TEntity GetByID(object id);
        bool Exists(TEntity entity);
    }
}
