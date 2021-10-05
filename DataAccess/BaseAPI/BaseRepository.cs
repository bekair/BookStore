using DataAccess.DbContext;
using EntityStore.Base;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace DataAccess.BaseAPI
{
    public class BaseRepository<TEntity> : IRepository<TEntity> where TEntity : class, IEntity
    {
        protected BookStoreDbContext dbContext;
        protected DbSet<TEntity> dbEntity;

        public BaseRepository(BookStoreDbContext dbContext)
        {
            this.dbContext = dbContext;
            this.dbEntity = dbContext.Set<TEntity>();
        }

        public virtual void Insert(TEntity entity)
        {
            dbEntity.Add(entity);
        }

        public void AddOrUpdate(TEntity entity)
        {
            if (Exists(entity))
            {
                Update(entity);
            }
            else
            {
                Insert(entity);
            }
        }

        public virtual TEntity GetByID(object id)
        {
            return dbEntity.Find(id);
        }

        public virtual void Update(TEntity entity)
        {
            dbEntity.Attach(entity);
            dbContext.Entry(entity).State = EntityState.Modified;
        }

        public virtual void Delete(TEntity entity)
        {
            if (dbContext.Entry(entity).State == EntityState.Detached)
            {
                dbContext.Attach(entity);
            }
            dbEntity.Remove(entity);
        }

        public void Delete(object id)
        {
            TEntity entityToDelete = dbEntity.Find(id);
            Delete(entityToDelete);
        }

        public bool Exists(TEntity entity)
        {
            return dbEntity.Local.Any(e => e == entity);
        }
    }
}
